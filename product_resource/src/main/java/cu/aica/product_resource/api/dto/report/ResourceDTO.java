package cu.aica.product_resource.api.dto.report;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigInteger;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResourceDTO {

    private int id;
    private Integer idResourceFamily;
    private String ueb;
    private Integer codUeb;
    private String storage;
    private String name;
    private String codigo;
    private Double requiredCount;
    private Double existenceMistral;
    private String measureUnit;
    private String posible;
    private BigInteger posibleTotal;
}
