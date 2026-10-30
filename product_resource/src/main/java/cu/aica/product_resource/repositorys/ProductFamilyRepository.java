package cu.aica.product_resource.repositorys;

import cu.aica.product_resource.models.ProductFamily;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductFamilyRepository extends JpaRepository<ProductFamily, Integer> {

    ProductFamily findByIdEnterpriseAndName(Integer idEnterprise, String name);

    List<ProductFamily> findAllByIdEnterprise(Integer idEnterprise, Sort sort);

}