package cu.aica.product_resource.services;

import cu.aica.product_resource.models.Relation;
import cu.aica.product_resource.repositorys.RelationRepository;
import cu.aica.product_resource.repositorys.ResourceFamilyRelationRepository;
import cu.aica.product_resource.utils.Constants;
import cu.aica.product_resource.utils.exception.ResourceNotFoundException;
import cu.aica.product_resource.utils.payload.response.DeleteResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class RelationService {

    @Autowired
    private RelationRepository repository;

    @Autowired
    private ResourceFamilyRelationRepository resourceFamilyRelationRepository;

    public Iterable<Relation> findAll() {

        return repository.findAll();
    }

    public List<Relation> getAllFilter(String productFamilyName, String name, String criterio, String date, String baseCount, String resourceFamilyName) {

        return StreamSupport.stream(repository.findAll().spliterator(), false)
                .filter(item -> (
                        item.getProductFamily().getName().toLowerCase().contains(productFamilyName.toLowerCase()) &&
                                item.getName().toLowerCase().contains(name.toLowerCase()) &&
                                item.getCriterio().toLowerCase().contains(criterio.toLowerCase()) &&
                                (item.getDate() != null ? item.getDate().toString() : "").contains(date) &&
                                (item.getBaseCount() != null ? item.getBaseCount().toString() : "").contains(baseCount) &&
                                (item.getResourceFamilyBase() != null ? item.getResourceFamilyBase().getName().toLowerCase(): "").contains(resourceFamilyName.toLowerCase())
                )).collect(Collectors.toList());
    }

    public List<Relation> getAllByIdProductFamily(Integer idProductFamily){
        return repository.findAllByIdProductFamily(idProductFamily);
    }

    public Relation getById(int id) {
        Optional<Relation> item = repository.findById(id);
        if (item.isPresent()) {
            return item.get();
        } else {
            throw new ResourceNotFoundException("Record not found with id = " + id);
        }
    }

    public Relation save(Relation entity) {

        return repository.save(entity);
    }

    public DeleteResponse delete(int id) {
        DeleteResponse result = new DeleteResponse("successful");
        try {
            Relation relation = getById(id);
            if (relation.getCriterio().equals(Constants.PRODUCT_RESOURCE_RELATION_CRITERIA_3) && relation.getProductFamily().getRelations().stream().anyMatch(item -> item.getCriterio().equals(Constants.PRODUCT_RESOURCE_RELATION_CRITERIA_4))){
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
