package cu.aica.product_resource.services;

import cu.aica.product_resource.api.dto.report.*;
import cu.aica.product_resource.consuming.models.Entity;
import cu.aica.product_resource.consuming.models.Lab;
import cu.aica.product_resource.consuming.models.ResourceMistral;
import cu.aica.product_resource.consuming.services.EntityService;
import cu.aica.product_resource.consuming.services.LabService;
import cu.aica.product_resource.consuming.services.MistralService;
import cu.aica.product_resource.models.*;
import cu.aica.product_resource.utils.Constants;
import cu.aica.product_resource.utils.MathRound;
import cu.aica.product_resource.utils.MeasureUnitConvert;
import io.swagger.annotations.ApiParam;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private ProductFamilyService productFamilyService;

    @Autowired
    private EntityService entityService;

    @Autowired
    private LabService labService;

    @Autowired
    private MistralService mistralService;

    @Autowired
    private ResourceFamilyRelationService rfrService;

    @Autowired
    private ResourceFamilyService resourceFamilyService;


    public List<ResourceFamilyDTO> resourceByProduct(Integer idProductFamily, Integer count) {
        ProductFamily productFamily = productFamilyService.getById(idProductFamily);

        List<ResourceFamilyDTO> listDTO = new ArrayList<>();

        List<Entity> entities = entityService.getAllEntity();

        productFamily.getRelations().forEach(relation -> {

            Integer baseCount = relation.getBaseCount();

            relation.getResourceFamilyRelations().forEach(rfr -> {

                ResourceFamily rf = rfr.getResourceFamily();
                String resourceType = rfr.getIdType() != null ? rfr.getResourceType().getName() : "";
                Double referenceCount = rfr.getReferenceCount();

                RequiredCountDTO requiredCountDTO = requiredCount(idProductFamily, count, referenceCount, relation);

                Double requiredCount = requiredCountDTO.getRequiredCount();
                String resourceFamilyBaseName = requiredCountDTO.getResourceFamilyBaseName();

                MistralCountTotalDTO mistralCountTotalDTO = mistralCountTotal(rf, rfr, requiredCount, requiredCountDTO.getConsumptionIndex());

                List<ResourceDTO> resourceList = mistralCountTotalDTO.getResourceList();
                Double mistralTotalCount = mistralCountTotalDTO.getMistralTotalCount();

                BigInteger posibleTotal = mistralTotalCount > 0 ? (BigDecimal.valueOf(mistralTotalCount).multiply(requiredCountDTO.getConsumptionIndex())).toBigInteger() : BigInteger.valueOf(0);

                ResourceFamilyDTO resourceFamilyDTO = new ResourceFamilyDTO(rf.getId(),
                        entities.stream().filter(entity -> entity.getId() == rf.getIdEnterprise()).findFirst().orElse(new Entity()).getName(),
                        relation.getName(),
                        relation.getCriterio(),
                        baseCount,
                        resourceFamilyBaseName,
                        rf.getName(),
                        resourceType,
                        referenceCount,
                        MathRound.fourFixeds(requiredCount),
                        MathRound.fourFixeds(mistralTotalCount),
                        rfr.getMeasureUnit(),
                        requiredCount <= mistralTotalCount ? "Si" : "No",
                        posibleTotal,
                        requiredCountDTO.getConsumptionIndex(),
                        resourceList
                );

                listDTO.add(resourceFamilyDTO);

            });

        });

        listDTO.sort(new ResourceFamilyDTOComparator("asc", "order"));

        return listDTO;
    }

    public List<NationalDemandDTO> simulateDemand(Integer idProductFamily, Integer nationalDemand, Integer demand) {
        ProductFamily productFamily = productFamilyService.getById(idProductFamily);

        List<NationalDemandDTO> listDTO = new ArrayList<>();

        List<Entity> entities = entityService.getAllEntity();

        productFamily.getRelations().forEach(relation -> {

            Integer baseCount = relation.getBaseCount();

            relation.getResourceFamilyRelations().forEach(rfr -> {

                ResourceFamily rf = rfr.getResourceFamily();
                String resourceType = rfr.getIdType() != null ? rfr.getResourceType().getName() : "";
                Double referenceCount = rfr.getReferenceCount();

                RequiredCountDTO requiredCountNationalDemandDTO = requiredCount(idProductFamily, nationalDemand, referenceCount, relation);
                RequiredCountDTO requiredCountDemandDTO = requiredCount(idProductFamily, demand, referenceCount, relation);

                Double requiredCountNationalDemand = requiredCountNationalDemandDTO.getRequiredCount();
                Double requiredCountDemand = requiredCountDemandDTO.getRequiredCount();

                MistralCountTotalDTO mistralCountTotalDTO = simulateDemandMistralCountTotal(rf, rfr, requiredCountNationalDemand, requiredCountDemand, requiredCountNationalDemandDTO.getConsumptionIndex());

                Double mistralTotalCount = mistralCountTotalDTO.getMistralTotalCount();
                Double mistralSurplus = mistralTotalCount - requiredCountNationalDemand;
                List<NationalDemandResourceDTO> resourceList = mistralCountTotalDTO.getNationalDemandResourceList();

                BigDecimal index = requiredCountDemandDTO.getConsumptionIndex();

                BigInteger posibleTotal = mistralSurplus > 0 ? (BigDecimal.valueOf(mistralSurplus).multiply(index)).toBigInteger() : BigInteger.valueOf(0);

                NationalDemandDTO resourceFamilyDTO = new NationalDemandDTO(rf.getId(),
                        entities.stream().filter(entity -> entity.getId() == rf.getIdEnterprise()).findFirst().orElse(new Entity()).getName(),
                        relation.getName(),
                        relation.getCriterio(),
                        baseCount,
                        rf.getName(),
                        resourceType,
                        referenceCount,
                        MathRound.fourFixeds(mistralTotalCount),
                        MathRound.fourFixeds(requiredCountNationalDemand),
                        MathRound.fourFixeds(mistralSurplus),
                        MathRound.fourFixeds(requiredCountDemand),
                        rfr.getMeasureUnit(),
                        requiredCountDemand <= mistralSurplus ? "Si" : "No",
                        posibleTotal,
                        resourceList
                );

                listDTO.add(resourceFamilyDTO);

            });

        });

        listDTO.sort(new NationalDemandDTOComparator("asc", "order"));

        return listDTO;
    }

    private RequiredCountDTO requiredCount(Integer idProductFamily, Integer count, Double referenceCount, Relation relation) {

        Integer baseCount = relation.getBaseCount();
        Double requiredCount = referenceCount * count / baseCount;

        BigDecimal consumptionIndex = BigDecimal.valueOf(baseCount).divide(BigDecimal.valueOf(referenceCount), 2, RoundingMode.HALF_UP);

        String resourceFamilyBaseName = "";
        if (relation.getIdResourceFamily() != null) {
            ResourceFamily resourceFamilyBase = relation.getResourceFamilyBase();
            resourceFamilyBaseName = resourceFamilyBase.getName();

            ResourceFamilyRelation resourceFamilyRelationBase = resourceFamilyBase.getResourceFamilyRelations().stream().filter(item -> item.getRelation().getIdProductFamily() == idProductFamily && item.getRelation().getCriterio().equals(Constants.PRODUCT_RESOURCE_RELATION_CRITERIA_3)).findFirst().orElse(new ResourceFamilyRelation());

            Integer baseCountBase = resourceFamilyRelationBase.getRelation().getBaseCount();
            Double referenceCountBase = MeasureUnitConvert.convert(resourceFamilyRelationBase.getReferenceCount(), resourceFamilyRelationBase.getMeasureUnit(), "U");
            Double requiredCountBase = referenceCountBase * count / baseCountBase;
            Double consumptionIndexBase = baseCountBase/referenceCountBase;

            requiredCount = referenceCount * requiredCountBase / baseCount;

            Double index = Math.ceil(requiredCount / referenceCount);
            requiredCount = index * referenceCount;

            consumptionIndex = BigDecimal.valueOf(consumptionIndexBase).multiply(BigDecimal.valueOf(baseCount)).divide(BigDecimal.valueOf(referenceCount), 2, RoundingMode.HALF_UP);
        }
        return new RequiredCountDTO(requiredCount, resourceFamilyBaseName, consumptionIndex);
    }

    private MistralCountTotalDTO mistralCountTotal(ResourceFamily rf, ResourceFamilyRelation rfr, Double requiredCount, BigDecimal consumptionIndex) {
        List<ResourceDTO> resourceList = new ArrayList<>();
        List<Lab> labList = labService.getAllLabs(null);

        Double mistralTotalCount = 0.0;

        for (Resource resource : rf.getResources()) {
            Lab lab = labList.stream().filter(ele -> ele.getCodigo() == resource.getCodUeb()).findFirst().orElse(new Lab());
            ResourceMistral resourceMistral = mistralService.getResource(resource.getCodUeb(), resource.getStorage(), resource.getCodigo());

            Double mistralCount = MeasureUnitConvert.convert(resourceMistral.getCount(), resourceMistral.getMeasureUnit(), rfr.getMeasureUnit());
            BigInteger posibleTotal = mistralCount > 0 ? (BigDecimal.valueOf(mistralCount).multiply(consumptionIndex)).toBigInteger() : BigInteger.valueOf(0);

            mistralTotalCount += mistralCount;

            ResourceDTO resourceDTO = new ResourceDTO(
                    resource.getId(),
                    resource.getIdResourceFamily(),
                    lab.getNombre(),
                    resource.getCodUeb(),
                    resource.getStorage(),
                    resourceMistral.getName(),
                    resource.getCodigo(),
                    MathRound.fourFixeds(requiredCount),
                    MathRound.fourFixeds(mistralCount),
                    rfr.getMeasureUnit(),
                    requiredCount <= mistralCount ? "Si" : "No",
                    posibleTotal);

            resourceList.add(resourceDTO);
        }
        MistralCountTotalDTO result = new MistralCountTotalDTO();
        result.setMistralTotalCount(mistralTotalCount);
        result.setResourceList(resourceList);
        return result;
    }

    private MistralCountTotalDTO simulateDemandMistralCountTotal(ResourceFamily rf, ResourceFamilyRelation rfr, Double requiredCountNationalDemand, Double demand, BigDecimal consumptionIndex) {
        List<NationalDemandResourceDTO> resourceList = new ArrayList<>();
        List<Lab> labList = labService.getAllLabs(null);

        Double mistralTotalCount = 0.0;

        for (Resource resource : rf.getResources()) {
            Lab lab = labList.stream().filter(ele -> ele.getCodigo() == resource.getCodUeb()).findFirst().orElse(new Lab());
            ResourceMistral resourceMistral = mistralService.getResource(resource.getCodUeb(), resource.getStorage(), resource.getCodigo());

            Double mistralCount = MeasureUnitConvert.convert(resourceMistral.getCount(), resourceMistral.getMeasureUnit(), rfr.getMeasureUnit());

            mistralTotalCount += mistralCount;

            Double mistralSurplus = mistralCount - requiredCountNationalDemand;
            BigInteger posibleTotal = mistralSurplus > 0 ? (BigDecimal.valueOf(mistralSurplus).multiply(consumptionIndex)).toBigInteger() : BigInteger.valueOf(0);


            NationalDemandResourceDTO resourceDTO = new NationalDemandResourceDTO(
                    resource.getId(),
                    resource.getIdResourceFamily(),
                    lab.getNombre(),
                    resource.getCodUeb(),
                    resource.getStorage(),
                    resourceMistral.getName(),
                    resource.getCodigo(),
                    MathRound.fourFixeds(demand),
                    MathRound.fourFixeds(mistralCount),
                    rfr.getMeasureUnit(),
                    demand <= mistralSurplus ? "Si" : "No",
                    posibleTotal,
                    MathRound.fourFixeds(requiredCountNationalDemand),
                    MathRound.fourFixeds(mistralSurplus),
                    MathRound.fourFixeds(demand));

            resourceList.add(resourceDTO);
        }
        MistralCountTotalDTO result = new MistralCountTotalDTO();
        result.setMistralTotalCount(mistralTotalCount);
        result.setNationalDemandResourceList(resourceList);
        return result;
    }

    public List<ProductFamilyDTO> productByResource(Integer idResourceFamily) {

        List<ProductFamilyDTO> listDTO = new ArrayList<>();

        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);

        rfrService.getAllByIdResourceFamily(idResourceFamily).stream().forEach(item -> {

            cu.aica.product_resource.api.dto.ProductFamilyDTO productFamilyDTO = productFamilyService.getProductFamilyDTOById(item.getRelation().getIdProductFamily());

            Relation relation = item.getRelation();

            ProductFamilyDTO tempDTO = modelMapper.typeMap(cu.aica.product_resource.api.dto.ProductFamilyDTO.class, ProductFamilyDTO.class).addMappings(mapper -> {
                mapper.map(src -> MathRound.fourFixeds(item.getReferenceCount() * productFamilyDTO.getPlanThisYear() / relation.getBaseCount()), ProductFamilyDTO::setRequiredCountPlanThisYear);
                mapper.map(src -> MathRound.fourFixeds(item.getReferenceCount() * productFamilyDTO.getPlanNextYear() / relation.getBaseCount()), ProductFamilyDTO::setRequiredCountPlanNextYear);
                mapper.map(src -> relation.getName(), ProductFamilyDTO::setRelationName);
                mapper.map(src -> relation.getCriterio(), ProductFamilyDTO::setRelationCriterio);
                mapper.map(src -> relation.getBaseCount(), ProductFamilyDTO::setRelationBaseCount);
                mapper.map(src -> item.getResourceType().getName(), ProductFamilyDTO::setResourceType);
                mapper.map(src -> item.getReferenceCount(), ProductFamilyDTO::setReferenceCount);
                mapper.map(src -> item.getMeasureUnit(), ProductFamilyDTO::setMeasureUnit);
            }).map(productFamilyDTO);

            tempDTO.getProductList().stream().map(productDTO -> {
                if (relation.getProducts().stream().anyMatch(product -> product.getId().equals(productDTO.getId()))) {
                    productDTO.setSelected(true);
                } else {
                    productDTO.setSelected(false);
                }
                return productDTO;
            }).collect(Collectors.toList());

            if (relation.getIdResourceFamily() != null) {
                ResourceFamily resourceFamilyBase = relation.getResourceFamilyBase();
                ResourceFamilyRelation resourceFamilyRelationBase = resourceFamilyBase.getResourceFamilyRelations().stream().filter(rfr -> rfr.getRelation().getIdProductFamily() == relation.getIdProductFamily() && rfr.getRelation().getCriterio().equals(Constants.PRODUCT_RESOURCE_RELATION_CRITERIA_3)).findFirst().orElse(new ResourceFamilyRelation());

                Integer baseCount = tempDTO.getRelationBaseCount();
                Integer referenceCount = tempDTO.getReferenceCount().intValue();
                Integer baseCountBase = resourceFamilyRelationBase.getRelation().getBaseCount();

                tempDTO.setRelationBaseCount(baseCount * (baseCountBase / referenceCount));
                tempDTO.setReferenceCount(resourceFamilyRelationBase.getReferenceCount());
                tempDTO.setMeasureUnit(resourceFamilyRelationBase.getMeasureUnit());
            }

            listDTO.add(tempDTO);

        });


        return listDTO;
    }


    public ResourceExistenceDTO getExistence(Integer idResourceFamily) {

        ResourceFamily resourceFamily = resourceFamilyService.getById(idResourceFamily);

        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);


        List<Lab> labList = labService.getAllLabs(null);

        List<cu.aica.product_resource.api.dto.ResourceDTO> resourceDTOList = new ArrayList<>();

        Double mistralTotalCount = 0.0;

        ResourceExistenceDTO resourceExistenceDTO = new ResourceExistenceDTO();

        for (Resource item : resourceFamily.getResources()) {

            ResourceMistral resourceMistral = mistralService.getResource(item.getCodUeb(), item.getStorage(), item.getCodigo());
            String mistralCountString = resourceMistral.getCount() != null ? MathRound.fourFixeds(resourceMistral.getCount()).toString() : "";

            cu.aica.product_resource.api.dto.ResourceDTO tempDTO = modelMapper.typeMap(Resource.class, cu.aica.product_resource.api.dto.ResourceDTO.class).addMappings(mapper -> {
                mapper.map(src -> labList.stream().filter(ele -> ele.getCodigo().equals(item.getCodUeb())).findFirst().orElse(new Lab()).getNombre(), cu.aica.product_resource.api.dto.ResourceDTO::setUeb);
                mapper.map(src -> resourceMistral.getName(), cu.aica.product_resource.api.dto.ResourceDTO::setName);
                mapper.map(src -> mistralCountString + " " + resourceMistral.getMeasureUnit(), cu.aica.product_resource.api.dto.ResourceDTO::setMistralCount);
            }).map(item);

            resourceDTOList.add(tempDTO);

            if (resourceExistenceDTO.getMeasureUnit() == null)
                resourceExistenceDTO.setMeasureUnit(resourceMistral.getMeasureUnit());

            mistralTotalCount += MeasureUnitConvert.convert(resourceMistral.getCount(), resourceMistral.getMeasureUnit(), resourceExistenceDTO.getMeasureUnit());
        }

        resourceExistenceDTO.setResourceFamilyName(resourceFamily.getName());
        resourceExistenceDTO.setExistence(MathRound.fourFixeds(mistralTotalCount));
        resourceExistenceDTO.setResourceList(resourceDTOList);

        return resourceExistenceDTO;
    }

}
