package cu.aica.product_resource.services;

import cu.aica.product_resource.api.dto.ResourceTypeDTO;
import cu.aica.product_resource.consuming.services.EntityService;
import cu.aica.product_resource.consuming.models.Entity;
import cu.aica.product_resource.models.ResourceType;
import cu.aica.product_resource.repositorys.ResourceTypeRepository;
import cu.aica.product_resource.utils.exception.ResourceNotFoundException;
import cu.aica.product_resource.utils.payload.response.DeleteResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ResourceTypeService {

    @Autowired
    private ResourceTypeRepository repository;

    @Autowired
    private EntityService entityService;

    public List<ResourceTypeDTO> getAllFilter(Integer idEnterprise, String enterprise, String name) {

        Iterable<ResourceType> list = getAllFilterIdEnterpriseAndName(idEnterprise, name);

        List<Entity> entities = entityService.getAllEntity();

        List<ResourceTypeDTO> listDTO = new ArrayList<>();

        list.forEach(item-> {

            ResourceTypeDTO temp = new ResourceTypeDTO(item.getId(), item.getIdEnterprise(),
                    entities.stream().filter(entity -> entity.getId() == item.getIdEnterprise()).findFirst().orElse(new Entity()).getName(),
                    item.getName());

            if (temp.getEnterprise().toLowerCase().contains(enterprise.toLowerCase()))
                listDTO.add(temp);
        });

        return listDTO;

    }

//    public List<ResourceType> getAllByAttributes(Integer idEnterprise, String name) {
//
//        return StreamSupport.stream(repository.findAll().spliterator(), false)
//                .filter(item -> (
//                        (idEnterprise == -1 || item.getIdEnterprise() == idEnterprise) &&
//                                item.getName().toLowerCase().contains(name.toLowerCase())
//                )).collect(Collectors.toList());
//    }
//
//    public Iterable<ResourceType> getAll() {
//        return repository.findAll();
//    }

    public List<ResourceType> getAllFilterIdEnterpriseAndName(Integer idEnterprise, String name) {

        return repository.findByIdEnterpriseAndName(idEnterprise, name.toLowerCase());
    }

    public ResourceType getById(int id) {
        Optional<ResourceType> item = repository.findById(id);
        if (item.isPresent()) {
            return item.get();
        } else {
            throw new ResourceNotFoundException("Record not found with id = " + id);
        }
    }

    public ResourceType save(ResourceType entity) {
        return repository.save(entity);
    }

    public DeleteResponse delete(int id) {
        DeleteResponse result = new DeleteResponse("successful");
        try {

            if (getById(id).getResourceFamilyRelations().size() > 0){
                result.setMessage("restricted");
            } else {
                repository.deleteById(id);
            }
        } catch (Exception t) {
            result.setMessage("failed");
        }
        return result;
    }
}
