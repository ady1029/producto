package cu.aica.product_resource.services;

import cu.aica.product_resource.api.dto.ResourceFamilyRelationDTO;
import cu.aica.product_resource.consuming.services.EntityService;
import cu.aica.product_resource.consuming.models.Entity;
import cu.aica.product_resource.models.Relation;
import cu.aica.product_resource.models.ResourceFamilyRelation;
import cu.aica.product_resource.repositorys.ResourceFamilyRelationRepository;
import cu.aica.product_resource.utils.exception.ResourceNotFoundException;
import cu.aica.product_resource.utils.payload.response.DeleteResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ResourceFamilyRelationService {

    @Autowired
    private ResourceFamilyRelationRepository repository;

    @Autowired
    private RelationService relationService;

    @Autowired
    private EntityService entityService;

    public List<ResourceFamilyRelationDTO> getAllFilter(int idRelation, String enterprise, String name, String resourceType, String referenceCount, String measureUnit) {


        List<ResourceFamilyRelation> list = repository.getAllByIdRelation(idRelation);

        List<ResourceFamilyRelationDTO> listDTO = new ArrayList<>();

        List<Entity> entities = entityService.getAllEntity();

        list.stream().forEach(item -> {

            String resourceTypeName =  item.getResourceType() != null ? item.getResourceType().getName() : "";


            ResourceFamilyRelationDTO dto = new ResourceFamilyRelationDTO(item.getId(), item.getIdRelation(), item.getIdResourceFamily(),
                    entities.stream().filter(entity -> entity.getId() == item.getResourceFamily().getIdEnterprise()).findFirst().orElse(new Entity()).getName(),
                    item.getResourceFamily().getName(),
                    item.getIdType(),
                    resourceTypeName,
                    item.getReferenceCount(),
                    item.getMeasureUnit()
            );

            String referenceCountString = item.getReferenceCount() != null ? item.getReferenceCount().toString() : "";


            if (dto.getEnterprise().toLowerCase().contains(enterprise.toLowerCase()) &&
                    dto.getName().toLowerCase().contains(name.toLowerCase()) &&
                    dto.getResourceType().toLowerCase().contains(resourceType.toLowerCase()) &&
                    referenceCountString.contains(referenceCount.toLowerCase()) &&
                    (dto.getMeasureUnit() != null ? dto.getMeasureUnit(): "").toLowerCase().contains(measureUnit.toLowerCase())
                    )
                listDTO.add(dto);

        });


        return listDTO;
    }

    public ResourceFamilyRelation getById(int id) {
        Optional<ResourceFamilyRelation> resourceFamily = repository.findById(id);
        if (resourceFamily.isPresent()) {
            return resourceFamily.get();
        } else {
            throw new ResourceNotFoundException("Record not found with id = " + id);
        }
    }

    public List<ResourceFamilyRelation> getAllByIdResourceFamily(int idResourceFamily){
        return repository.getAllByIdResourceFamily(idResourceFamily);
    }

    public ResourceFamilyRelation save(ResourceFamilyRelation entity) {
        return repository.save(entity);
    }

    public DeleteResponse delete(int id) {
        DeleteResponse result = new DeleteResponse("successful");
        try {

            ResourceFamilyRelation resourceFamilyRelation = getById(id);
            Relation relation = resourceFamilyRelation.getRelation();

            if (relation.getResourceFamilyRelations().size() > 1){
                relation.getResourceFamilyRelations().remove(resourceFamilyRelation);
                relationService.save(relation);
                repository.deleteById(id);
            }
            else {
                result.setMessage("restricted");
            }

        } catch (Exception t) {
            result.setMessage("failed");
        }
        return result;
    }
}
