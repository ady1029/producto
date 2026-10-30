package cu.aica.product_resource.services;

import cu.aica.product_resource.api.dto.ResourceFamilyDTO;
import cu.aica.product_resource.consuming.services.EntityService;
import cu.aica.product_resource.consuming.models.Entity;
import cu.aica.product_resource.models.ResourceFamily;
import cu.aica.product_resource.repositorys.ResourceFamilyRepository;
import cu.aica.product_resource.utils.exception.ResourceNotFoundException;
import cu.aica.product_resource.utils.payload.response.DeleteResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class ResourceFamilyService {

    @Autowired
    private ResourceFamilyRepository repository;

    @Autowired
    private EntityService entityService;

    public Iterable<ResourceFamily> getAll() {
        return repository.findAll();
    }

    public List<ResourceFamilyDTO> getAllFilter(Integer idEnterprise, String enterprise, String name, Integer idProductFamily, String relationCriteria, String resourceType){

        Iterable<ResourceFamily> list = getAllByAttributes(idEnterprise, name);

        List<Entity> entities = entityService.getAllEntity();

        List<ResourceFamilyDTO> listDTO = new ArrayList<>();

        list.forEach(item-> {

            ResourceFamilyDTO temp = new ResourceFamilyDTO(item.getId(), item.getIdEnterprise(),
                    entities.stream().filter(entity -> entity.getId() == item.getIdEnterprise()).findFirst().orElse(new Entity()).getName(),
                    item.getName());

            if (temp.getEnterprise().toLowerCase().contains(enterprise.toLowerCase()) &&
                    (idProductFamily == -1 || item.getResourceFamilyRelations().stream().anyMatch(rfl -> rfl.getRelation().getIdProductFamily().equals(idProductFamily) &&
                            rfl.getRelation().getCriterio().toLowerCase().contains(relationCriteria.toLowerCase()) && rfl.getResourceType().getName().contains(resourceType)))
                    )
                listDTO.add(temp);
        });

        return listDTO;
    }

    public List<ResourceFamilyDTO> getAllFilter(Integer idEnterprise, String enterprise, String name){

        Iterable<ResourceFamily> list = getAllByAttributes(idEnterprise, name);

        List<Entity> entities = entityService.getAllEntity();

        List<ResourceFamilyDTO> listDTO = new ArrayList<>();

        list.forEach(item-> {

            ResourceFamilyDTO temp = new ResourceFamilyDTO(item.getId(), item.getIdEnterprise(),
                    entities.stream().filter(entity -> entity.getId() == item.getIdEnterprise()).findFirst().orElse(new Entity()).getName(),
                    item.getName());

            if (temp.getEnterprise().toLowerCase().contains(enterprise.toLowerCase()))
                listDTO.add(temp);
        });

        return listDTO;
    }

    public List<ResourceFamily> getAllByAttributes(Integer idEnterprise, String name) {

        return StreamSupport.stream(repository.findAll().spliterator(), false)
                .filter(item -> (
                        (idEnterprise == -1 || item.getIdEnterprise() == idEnterprise) &&
                                item.getName().toLowerCase().contains(name.toLowerCase())
                )).collect(Collectors.toList());
    }

    public ResourceFamily getById(int id) {
        Optional<ResourceFamily> resourceFamily = repository.findById(id);
        if (resourceFamily.isPresent()) {
            return resourceFamily.get();
        } else {
            throw new ResourceNotFoundException("Record not found with id = " + id);
        }
    }

    public ResourceFamily save(ResourceFamily entity) {
        return repository.save(entity);
    }

    public DeleteResponse delete(int id) {
        DeleteResponse result = new DeleteResponse("successful");
        try {

            ResourceFamily resourceFamily = getById(id);
            if (resourceFamily.getRelationsBase().size() == 0 && resourceFamily.getResourceFamilyRelations().size() == 0){
                repository.deleteById(id);
            } else {
                result.setMessage("restricted");
            }

        } catch (Exception t) {
            result.setMessage("failed");
        }
        return result;
    }
}
