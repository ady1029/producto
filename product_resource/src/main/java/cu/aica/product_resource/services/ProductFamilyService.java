package cu.aica.product_resource.services;

import cu.aica.product_resource.api.dto.ProductDTO;
import cu.aica.product_resource.api.dto.ProductFamilyDTO;
import cu.aica.product_resource.api.dto.ProductionPlanDTO;
import cu.aica.product_resource.consuming.models.Lab;
import cu.aica.product_resource.consuming.services.EntityService;
import cu.aica.product_resource.consuming.services.LabService;
import cu.aica.product_resource.consuming.services.MistralService;
import cu.aica.product_resource.consuming.models.Entity;
import cu.aica.product_resource.models.Product;
import cu.aica.product_resource.models.ProductFamily;
import cu.aica.product_resource.models.Resource;
import cu.aica.product_resource.models.ResourceFamily;
import cu.aica.product_resource.repositorys.ProductFamilyRepository;
import cu.aica.product_resource.utils.exception.ResourceNotFoundException;
import cu.aica.product_resource.utils.payload.response.DeleteResponse;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class ProductFamilyService {


    @Autowired
    private ProductFamilyRepository repository;

    @Autowired
    private EntityService entityService;

    @Autowired
    private LabService labService;

    @Autowired
    private MistralService mistralService;

    @Autowired
    private ProductService productService;

    public List<ProductFamily> getAll(Integer idEnterprise) {
        if (idEnterprise == -1) {
            return repository.findAll(Sort.by("name").ascending());
        } else {
            return repository.findAllByIdEnterprise(idEnterprise, Sort.by("name").ascending());
        }
    }

    public List<ProductFamilyDTO> getAllFilter(Integer idEnterprise, String enterprise, String uebFilter, String name, String pharmaceuticShape, String format, String nationalDemand) {

        Iterable<ProductFamily> list = getAllByAttributes(idEnterprise, name, format, nationalDemand);

        List<Entity> entities = entityService.getAllEntity();
        List<Lab> labList = labService.getAllLabs(null);

        List<ProductFamilyDTO> listDTO = new ArrayList<>();

        list.forEach(item -> {

//            Product product = item.getProducts().get(0);
//            String phS = mistralService.getProductMistral(product.getCodUeb(), product.getCup()).getPharmaceuticShape();

            ProductFamilyDTO temp = mapProductFamily(item, entities, labList);

            if (temp.getEnterprise().toLowerCase().contains(enterprise.toLowerCase()) &&
                    temp.getUebs().toLowerCase().contains(uebFilter.toLowerCase()) &&
                    temp.getPharmaceuticShape().toLowerCase().contains(pharmaceuticShape.toLowerCase())
                    )
                listDTO.add(temp);
        });

        return listDTO;

    }

    public List<ProductFamily> getAllByAttributes(Integer idEnterprise, String name, String format, String nationalDemand) {

        return StreamSupport.stream(repository.findAll().spliterator(), false)
                .filter(item -> (
                        (idEnterprise == -1 || item.getIdEnterprise() == idEnterprise) &&
                                item.getName().toLowerCase().contains(name.toLowerCase()) &&
                                (item.getFormat() != null ? item.getFormat().toLowerCase() : "").contains(format.toLowerCase()) &&
                                (item.getNationalDemand() != null ? item.getNationalDemand().toString() : "").contains(nationalDemand)

                )).collect(Collectors.toList());
    }

    public List<ProductionPlanDTO> getAllPlanProduction(String enterprise, String name, String planThisYear, String planNextYear){
        List<ProductionPlanDTO> productionPlanDTOList = new ArrayList<>();

        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);

        List<Entity> entities = entityService.getAllEntity();

        repository.findAll().stream().parallel().forEach(item -> {

            ProductionPlanDTO productionPlanDTO = modelMapper.typeMap(ProductFamily.class, ProductionPlanDTO.class).addMappings(mapper -> {
                mapper.map(src -> entities.stream().filter(entity -> entity.getId() == item.getIdEnterprise()).findFirst().orElse(new Entity()).getName(), ProductionPlanDTO::setEnterprise);
            }).map(item);

            if (productionPlanDTO.getEnterprise().toLowerCase().contains(enterprise.toLowerCase()) &&
                productionPlanDTO.getName().toLowerCase().contains(name.toLowerCase()) &&
                    productionPlanDTO.getPlanThisYear().toString().contains(planThisYear) &&
                    productionPlanDTO.getPlanNextYear().toString().contains(planNextYear)){

                productionPlanDTOList.add(productionPlanDTO);
            }
        });

        return productionPlanDTOList;
    }

    public ProductFamilyDTO getProductFamilyDTOById(int id) {
        ProductFamily productFamily = getById(id);

        Product product = productFamily.getProducts().get(0);
        String phS = mistralService.getProductMistral(product.getCodUeb(), product.getCup()).getPharmaceuticShape();
        List<Entity> entities = entityService.getAllEntity();

        List<ProductDTO> productDTOS = productService.getAllFilter(productFamily.getId(), "", "", "", "", "", "");
        List<String> uebs = new ArrayList<>();
        productDTOS.forEach(productDTO -> {
            if (uebs.stream().noneMatch(ueb -> ueb.equals(productDTO.getUeb()))){
                uebs.add(productDTO.getUeb());
            }
        });

        return new ProductFamilyDTO(productFamily.getId(), productFamily.getIdEnterprise(),
                entities.stream().filter(entity -> entity.getId() == productFamily.getIdEnterprise()).findFirst().orElse(new Entity()).getName(),
                uebs.toString().replace("[", "").replace("]", ""),
                productFamily.getName(),
                phS,
                productFamily.getFormat(),
                productFamily.getLyophilized(),
                productFamily.getReserve(),
                productFamily.getAtc(),
                productFamily.getPriority(),
                productFamily.getNationalDemand(),
                productFamily.getUpdated(),
                productDTOS,
                productFamily.getPlanThisYear(),
                productFamily.getPlanNextYear()
        );

    }

    public ProductFamily getById(int id) {
        Optional<ProductFamily> productFamily = repository.findById(id);
        if (productFamily.isPresent()) {
            return productFamily.get();
        } else {
            throw new ResourceNotFoundException("Record not found with id = " + id);
        }
    }

    public List<ProductFamilyDTO> getIndirectProductFamily(Integer idProductFamily) {
        ProductFamily productFamily = getById(idProductFamily);
        List<ResourceFamily> rfList =  new ArrayList<>();
        productFamily.getRelations().forEach(relation -> {
            relation.getResourceFamilyRelations().forEach(rfr -> {
                ResourceFamily rf = rfr.getResourceFamily();
                if (rfList.stream().noneMatch(item -> item.getId().equals(rf.getId()))){
                    rfList.add(rf);
                }
            });
        });

        List<ProductFamilyDTO> pfList = new ArrayList<>();

        List<Entity> entities = entityService.getAllEntity();
        List<Lab> labList = labService.getAllLabs(null);

        rfList.forEach(rf -> {
            rf.getResourceFamilyRelations().forEach(rfr -> {
                ProductFamily pf = rfr.getRelation().getProductFamily();
                if (!idProductFamily.equals(pf.getId()) && pfList.stream().noneMatch(item -> item.getId().equals(pf.getId()))){
                    pfList.add(mapProductFamily(pf, entities, labList));
                }
            });
        });

        return pfList;
    }

    private ProductFamilyDTO mapProductFamily(ProductFamily item, List<Entity> entities, List<Lab> labList){
        String phS = "";

        List<ProductDTO> productDTOS = productService.getAllFilterWithoutMistral(item.getId(), labList);
        List<String> uebs = new ArrayList<>();
        productDTOS.forEach(productDTO -> {
            if (uebs.stream().noneMatch(ueb -> ueb.equals(productDTO.getUeb()))){
                uebs.add(productDTO.getUeb());
            }
        });

        return new ProductFamilyDTO(item.getId(), item.getIdEnterprise(),
                entities.stream().filter(entity -> entity.getId() == item.getIdEnterprise()).findFirst().orElse(new Entity()).getName(),
                uebs.toString().replace("[", "").replace("]", ""),
                item.getName(),
                phS,
                item.getFormat(),
                item.getLyophilized(),
                item.getReserve(),
                item.getAtc(),
                item.getPriority(),
                item.getNationalDemand(),
                item.getUpdated(),
                productDTOS,
                item.getPlanThisYear(),
                item.getPlanNextYear()
        );

    }

    public ProductFamily save(ProductFamily entity) {
        entity.setUpdated(new Date(new java.util.Date().getTime()));
        return repository.save(entity);
    }

    public ProductionPlanDTO updatePorductionPlan(ProductionPlanDTO productionPlanDTO){
        ProductFamily productFamily = getById(productionPlanDTO.getId());
        productFamily.setPlanThisYear(productionPlanDTO.getPlanThisYear());
        productFamily.setPlanNextYear(productionPlanDTO.getPlanNextYear());
        repository.save(productFamily);
        return productionPlanDTO;
    }

    public DeleteResponse delete(int id) {
        DeleteResponse result = new DeleteResponse("successful");
        try {
            ProductFamily productFamily = getById(id);
            if (productFamily.getRelations().size() == 0)
                repository.deleteById(id);
            else {
                result.setMessage("restricted");
            }

        } catch (Exception t) {
            result.setMessage("failed");
        }
        return result;
    }

}
