package cu.aica.product_resource.services;

import cu.aica.product_resource.models.MeasureUnit;
import cu.aica.product_resource.repositorys.MeasureUnitRepository;
import cu.aica.product_resource.utils.exception.ResourceNotFoundException;
import cu.aica.product_resource.utils.payload.response.DeleteResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MeasureUnitService {

    @Autowired
    private MeasureUnitRepository repository;


    public List<MeasureUnit> getAllFilterByAttributes(String name) {

//        Pageable paging = PageRequest.of(pageNo, pageSize, sort.equals("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending());

        return repository.findByName(name);
    }

    public MeasureUnit getById(int id) {
        Optional<MeasureUnit> item = repository.findById(id);
        if (item.isPresent()) {
            return item.get();
        } else {
            throw new ResourceNotFoundException("Record not found with id = " + id);
        }
    }

    public MeasureUnit save(MeasureUnit entity) {
        return repository.save(entity);
    }

    public DeleteResponse delete(int id) {
        DeleteResponse result = new DeleteResponse("successful");
        try {

           /* if (getById(id).getProducts().size() > 0 && getById(id).getResources().size() > 0){
                result = "restricted";
            } else {
                repository.deleteById(id);
            }*/
            repository.deleteById(id);

        } catch (Exception t) {
            result.setMessage("failed");
        }
        return result;
    }




}
