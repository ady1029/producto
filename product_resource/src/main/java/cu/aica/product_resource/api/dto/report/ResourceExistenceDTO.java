package cu.aica.product_resource.api.dto.report;

import cu.aica.product_resource.api.dto.ResourceDTO;
import lombok.Data;

import java.util.List;

@Data
public class ResourceExistenceDTO {

    private String resourceFamilyName;
    private Double existence;
    private String measureUnit;
    private List<ResourceDTO> resourceList;

}
