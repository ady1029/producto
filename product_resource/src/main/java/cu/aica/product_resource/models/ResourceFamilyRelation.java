package cu.aica.product_resource.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Objects;

@Entity
@Table(name = "resource_family_relation", schema = "public", catalog = "product_resource")
public class ResourceFamilyRelation {
    private int id;
    @NotNull(message = "Resource Family is required.")
    private Integer idResourceFamily;
    private Integer idRelation;
    @NotNull(message = "Resource Type is required.")
    private Integer idType;
    @NotNull(message = "Reference count is required.")
    private Double referenceCount;
    @NotNull(message = "Measure Unit is required.")
    @NotEmpty(message = "Enter a valid Measure Unit.")
    private String measureUnit;
    private ResourceFamily resourceFamily;
    private Relation relation;
    private ResourceType resourceType;

    @Id
    @Column(name = "id")
    @GeneratedValue(generator = "resource_family_relation_id_seq")
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Column(name = "id_resource_family", nullable = false)
    public Integer getIdResourceFamily() {
        return idResourceFamily;
    }

    public void setIdResourceFamily(Integer idResourceFamily) {
        this.idResourceFamily = idResourceFamily;
    }

    @Column(name = "id_relation")
    public Integer getIdRelation() {
        return idRelation;
    }

    public void setIdRelation(Integer idRelation) {
        this.idRelation = idRelation;
    }

    @Basic
    @Column(name = "id_type", nullable = false)
    public Integer getIdType() {
        return idType;
    }

    public void setIdType(Integer idType) {
        this.idType = idType;
    }

    @Basic
    @Column(name = "reference_count", nullable = false, precision = 0)
    public Double getReferenceCount() {
        return referenceCount;
    }

    public void setReferenceCount(Double referenceCount) {
        this.referenceCount = referenceCount;
    }

    @Basic
    @Column(name = "measure_unit", nullable = false, length = -1)
    public String getMeasureUnit() {
        return measureUnit;
    }

    public void setMeasureUnit(String measureUnit) {
        this.measureUnit = measureUnit;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ResourceFamilyRelation that = (ResourceFamilyRelation) o;
        return
                id == that.id &&
                        Objects.equals(idResourceFamily, that.idResourceFamily) &&
                        Objects.equals(idRelation, that.idRelation) &&
                        Objects.equals(idType, that.idType) &&
                        Objects.equals(referenceCount, that.referenceCount) &&
                        Objects.equals(measureUnit, that.measureUnit);
    }

    @Override
    public int hashCode() {

        return Objects.hash(idResourceFamily, idRelation, idType, referenceCount, measureUnit);
    }

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "id_resource_family", referencedColumnName = "id", insertable = false, updatable = false)
    public ResourceFamily getResourceFamily() {
        return resourceFamily;
    }

    public void setResourceFamily(ResourceFamily resourceFamily) {
        this.resourceFamily = resourceFamily;
    }

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "id_relation", referencedColumnName = "id", insertable = false, updatable = false)
    public Relation getRelation() {
        return relation;
    }

    public void setRelation(Relation relation) {
        this.relation = relation;
    }

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "id_type", referencedColumnName = "id", insertable = false, updatable = false)
    public ResourceType getResourceType() {
        return resourceType;
    }

    public void setResourceType(ResourceType resourceType) {
        this.resourceType = resourceType;
    }
}
