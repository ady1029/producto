package cu.aica.product_resource.api.dto.report;

import cu.aica.product_resource.utils.Constants;
import lombok.Data;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.List;

@Data
public class NationalDemandDTO {

    private int id;
    private String enterprise;
    private String relationName;
    private String relationCriterio;
    private Integer relationBaseCount;
    private String name;
    private String resourceType;
    private Double referenceCount;
    private Double existenceMistral;
    private Double nationalDemand;
    private Double mistralSurplus;
    private Double demand;
    private String measureUnit;
    private String posible;
    private BigInteger posibleTotal;
    private Integer order;
    private List<NationalDemandResourceDTO> resourceList;


    public NationalDemandDTO() {
    }

    public NationalDemandDTO(int id, String enterprise, String relationName, String relationCriterio, Integer relationBaseCount, String name,
                             String resourceType, Double referenceCount, Double existenceMistral, Double nationalDemand, Double mistralSurplus,
                             Double demand, String measureUnit, String posible, BigInteger posibleTotal, List<NationalDemandResourceDTO> resourceList) {
        this.id = id;
        this.enterprise = enterprise;
        this.relationName = relationName;
        this.relationCriterio = relationCriterio;
        this.relationBaseCount = relationBaseCount;
        this.name = name;
        this.resourceType = resourceType;
        this.referenceCount = referenceCount;
        this.existenceMistral = existenceMistral;
        this.nationalDemand = nationalDemand;
        this.mistralSurplus = mistralSurplus;
        this.demand = demand;
        this.measureUnit = measureUnit;
        this.posible = posible;
        this.posibleTotal = posibleTotal;
        this.order = order(relationCriterio);
        this.resourceList = resourceList;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }

    private Integer order(String relationCriterio){
        switch (relationCriterio){
            case Constants.PRODUCT_RESOURCE_RELATION_CRITERIA_1:
                return 1;
            case Constants.PRODUCT_RESOURCE_RELATION_CRITERIA_2:
                return 2;
            case Constants.PRODUCT_RESOURCE_RELATION_CRITERIA_3:
                return 3;
            case Constants.PRODUCT_RESOURCE_RELATION_CRITERIA_4:
                return 4;
            default:
                return 0;
        }
    }
}
