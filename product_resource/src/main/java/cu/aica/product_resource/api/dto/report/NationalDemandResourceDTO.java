package cu.aica.product_resource.api.dto.report;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigInteger;

@Data
public class NationalDemandResourceDTO extends ResourceDTO {

    private Double nationalDemand;
    private Double mistralSurplus;
    private Double demand;



    public NationalDemandResourceDTO(int id, Integer idResourceFamily, String ueb, Integer codUeb, String storage, String name, String codigo, Double requiredCount, Double existenceMistral, String measureUnit, String posible, BigInteger posibleTotal, Double nationalDemand, Double mistralSurplus, Double demand) {
        super(id, idResourceFamily, ueb, codUeb, storage, name, codigo, requiredCount, existenceMistral, measureUnit, posible, posibleTotal);
        this.nationalDemand = nationalDemand;
        this.mistralSurplus = mistralSurplus;
        this.demand = demand;
    }
}
