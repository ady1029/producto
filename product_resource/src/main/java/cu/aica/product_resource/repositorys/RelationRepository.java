package cu.aica.product_resource.repositorys;

import cu.aica.product_resource.models.Relation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RelationRepository extends PagingAndSortingRepository<Relation, Integer> {

    List<Relation> findAllByIdProductFamily(Integer idProductFamily);
}