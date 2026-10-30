package cu.aica.product_resource.services;

import cu.aica.product_resource.api.dto.ResourceDTO;
import cu.aica.product_resource.consuming.services.LabService;
import cu.aica.product_resource.consuming.services.MistralService;
import cu.aica.product_resource.consuming.models.Lab;
import cu.aica.product_resource.consuming.models.ResourceMistral;
import cu.aica.product_resource.models.Resource;
import cu.aica.product_resource.models.ResourceFamily;
import cu.aica.product_resource.repositorys.ResourceRepository;
import cu.aica.product_resource.utils.exception.ResourceNotFoundException;
import cu.aica.product_resource.utils.payload.response.DeleteResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository repository;

    @Autowired
    private ResourceFamilyService resourceFamilyService;

    @Autowired
    private LabService labService;

    @Autowired
    private MistralService mistralService;

    public Iterable<Resource> findAll() {

        return repository.findAll();
    }

    public List<ResourceDTO> getAllFilter(Integer idResourceFamily, String ueb, String storage, String name, String codigo, String mistralCount) {
        Iterable<Resource> list = findByIdResourceFamily(idResourceFamily);

        List<ResourceDTO> listDTO = new ArrayList<ResourceDTO>();
        List<Lab> labList = labService.getAllLabs(null);

        list.forEach(item -> {

            Lab lab = labList.stream().filter(ele -> ele.getCodigo() == item.getCodUeb()).findFirst().orElse(new Lab());

            ResourceMistral resourceMistral = mistralService.getResource(item.getCodUeb(), item.getStorage(), item.getCodigo());
            String mistralCountString = resourceMistral.getCount() != null ? resourceMistral.getCount().toString() : "";

            ResourceDTO resourceDTO = new ResourceDTO(item.getId(), item.getIdResourceFamily(), item.getCodUeb(), lab.getNombre(), item.getStorage(),
                    resourceMistral.getName(), item.getCodigo(), mistralCountString +" "+ resourceMistral.getMeasureUnit());


            if (resourceDTO.getUeb().toLowerCase().contains(ueb.toLowerCase()) &&
                    resourceDTO.getStorage().toLowerCase().contains(storage.toLowerCase()) &&
                    resourceDTO.getName().toLowerCase().contains(name.toLowerCase()) &&
                    resourceDTO.getCodigo().toLowerCase().contains(codigo.toLowerCase()) &&
                    resourceDTO.getMistralCount().toLowerCase().contains(mistralCount.toLowerCase()))
                listDTO.add(resourceDTO);
        });

        return listDTO;
    }

    public Iterable<Resource> findByIdResourceFamily(Integer idResourceFamily) {

        return repository.findByIdResourceFamilyEquals(idResourceFamily);
    }

    public Resource getById(int id) {
        Optional<Resource> item = repository.findById(id);
        if (item.isPresent()) {
            return item.get();
        } else {
            throw new ResourceNotFoundException("Record not found with id = " + id);
        }
    }

    public DeleteResponse delete(int id) {
        DeleteResponse result = new DeleteResponse("successful");
        try {
            Resource resource = getById(id);
            ResourceFamily temp = resource.getResourceFamily();
            if (resource.getResourceFamily().getResources().size() > 1) {
                temp.getResources().remove(resource);
                resourceFamilyService.save(temp);
//                repository.deleteById(id);
            } else {
                result.setMessage("restricted");
            }

        } catch (Exception t) {
            result.setMessage("failed");
        }
        return result;
    }
}
