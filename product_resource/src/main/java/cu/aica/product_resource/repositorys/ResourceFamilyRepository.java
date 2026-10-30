package cu.aica.product_resource.repositorys;

import cu.aica.product_resource.models.ResourceFamily;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResourceFamilyRepository extends PagingAndSortingRepository<ResourceFamily, Integer> {

    ResourceFamily findByIdEnterpriseAndName(Integer idEnterprise, String name);
}
