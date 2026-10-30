package cu.aica.product_resource.repositorys;

import cu.aica.product_resource.models.MeasureUnit;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeasureUnitRepository extends PagingAndSortingRepository<MeasureUnit,Integer> {

    @Query(value = "SELECT m.* " +
            "FROM measure_unit m " +
            "WHERE LOWER(m.name) LIKE %?1% order by m.name ", nativeQuery = true
    )
    List<MeasureUnit> findByName(String name);
}