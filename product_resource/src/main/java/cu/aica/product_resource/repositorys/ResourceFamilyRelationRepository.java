package cu.aica.product_resource.repositorys;

import cu.aica.product_resource.models.ResourceFamilyRelation;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceFamilyRelationRepository extends PagingAndSortingRepository<ResourceFamilyRelation, Integer> {

    List<ResourceFamilyRelation> getAllByIdRelation(int idRelation);

    List<ResourceFamilyRelation> getAllByIdResourceFamily(int idResourceFamily);
}
