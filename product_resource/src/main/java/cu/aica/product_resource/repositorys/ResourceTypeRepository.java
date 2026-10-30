package cu.aica.product_resource.repositorys;

import cu.aica.product_resource.models.ResourceType;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceTypeRepository extends PagingAndSortingRepository<ResourceType,Integer> {


    @Query(value = "SELECT rt.* " +
            "FROM resource_type rt " +
            "WHERE ( rt.id_enterprise = ?1 OR ?1 = -1 ) AND LOWER(rt.name) LIKE %?2% order by rt.name ", nativeQuery = true
    )
    List<ResourceType> findByIdEnterpriseAndName(Integer idEnterprise, String name);
}