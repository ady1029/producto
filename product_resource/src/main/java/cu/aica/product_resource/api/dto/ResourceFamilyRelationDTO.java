package cu.aica.product_resource.api.dto;

public class ResourceFamilyRelationDTO {

    private int id;
    private int idRelation;
    private int idResourceFamily;
    private String enterprise;
    private String name;
    private Integer idType;
    private String resourceType;
    private Double referenceCount;
    private String measureUnit;


    public ResourceFamilyRelationDTO() {
    }

    public ResourceFamilyRelationDTO(int id, int idRelation, int idResourceFamily, String enterprise, String name, Integer idType, String resourceType, Double referenceCount, String measureUnit) {
        this.id = id;
        this.idRelation = idRelation;
        this.idResourceFamily = idResourceFamily;
        this.enterprise = enterprise;
        this.name = name;
        this.idType = idType;
        this.resourceType = resourceType;
        this.referenceCount = referenceCount;
        this.measureUnit = measureUnit;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getIdRelation() {
        return idRelation;
    }

    public void setIdRelation(int idRelation) {
        this.idRelation = idRelation;
    }

    public int getIdResourceFamily() {
        return idResourceFamily;
    }

    public void setIdResourceFamily(int idResourceFamily) {
        this.idResourceFamily = idResourceFamily;
    }

    public String getEnterprise() {
        return enterprise;
    }

    public void setEnterprise(String enterprise) {
        this.enterprise = enterprise;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getIdType() {
        return idType;
    }

    public void setIdType(Integer idType) {
        this.idType = idType;
    }

    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    public Double getReferenceCount() {
        return referenceCount;
    }

    public void setReferenceCount(Double referenceCount) {
        this.referenceCount = referenceCount;
    }

    public String getMeasureUnit() {
        return measureUnit;
    }

    public void setMeasureUnit(String measureUnit) {
        this.measureUnit = measureUnit;
    }
}
