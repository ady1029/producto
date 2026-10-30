package cu.aica.product_resource.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Set;
import java.util.Objects;

@Entity
@Table(name = "resource_type", schema = "public", catalog = "product_resource")
public class ResourceType {
    private int id;
    private Integer idEnterprise;
    private String name;
    private Set<ResourceFamilyRelation> resourceFamilyRelations;

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(generator = "resource_type_id_seq")
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Basic
    @Column(name = "id_enterprise", nullable = true)
    public Integer getIdEnterprise() {
        return idEnterprise;
    }

    public void setIdEnterprise(Integer idEnterprise) {
        this.idEnterprise = idEnterprise;
    }

    @Basic
    @Column(name = "name", nullable = true, length = 256)
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ResourceType that = (ResourceType) o;
        return id == that.id &&
                Objects.equals(name, that.name);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id, name);
    }

    @JsonIgnore
    @OneToMany(mappedBy = "resourceType")
    public Set<ResourceFamilyRelation> getResourceFamilyRelations() {
        return resourceFamilyRelations;
    }

    public void setResourceFamilyRelations(Set<ResourceFamilyRelation> resourceFamilyRelations) {
        this.resourceFamilyRelations = resourceFamilyRelations;
    }
}
