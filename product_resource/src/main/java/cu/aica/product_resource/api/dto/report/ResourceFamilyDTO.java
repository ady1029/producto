package cu.aica.product_resource.api.dto.report;

import cu.aica.product_resource.utils.Constants;
import lombok.Data;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.List;

@Data

public class ResourceFamilyDTO {


    private int id;
    private String enterprise;
    private String relationName;
    private String relationCriterio;
    private Integer relationBaseCount;
    private String relationBaseRF;
    private String name;
    private String resourceType;
    private Double referenceCount;
    private Double requiredCount;
    private Double existenceMistral;
    private String measureUnit;
    private String posible;
    private BigInteger posibleTotal;
    private BigDecimal consumptionIndex;
    private Integer order;
    private List<ResourceDTO> resourceList;

    public ResourceFamilyDTO() {
    }

    public ResourceFamilyDTO(int id, String enterprise, String relationName, String relationCriterio, Integer relationBaseCount,
                             String relationBaseRF, String name, String resourceType, Double referenceCount, Double requiredCount,
                             Double existenceMistral, String measureUnit, String posible, BigInteger posibleTotal, BigDecimal consumptionIndex, List<ResourceDTO> resourceList) {
        this.id = id;
        this.enterprise = enterprise;
        this.relationName = relationName;
        this.relationCriterio = relationCriterio;
        this.relationBaseCount = relationBaseCount;
        this.relationBaseRF = relationBaseRF;
        this.name = name;
        this.resourceType = resourceType;
        this.referenceCount = referenceCount;
        this.requiredCount = requiredCount;
        this.existenceMistral = existenceMistral;
        this.measureUnit = measureUnit;
        this.resourceList = resourceList;
        this.posible = posible;
        this.posibleTotal = posibleTotal;
        this.consumptionIndex = consumptionIndex;
        this.order = order(relationCriterio);
    }

    public Integer order(String relationCriterio){
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
