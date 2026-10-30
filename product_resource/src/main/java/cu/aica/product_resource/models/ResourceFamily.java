package cu.aica.product_resource.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import cu.aica.product_resource.utils.validation.NameUnique;

import javax.persistence.*;
import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Objects;
import java.util.Set;

@Entity
@NameUnique(columnNames={"idEnterprise", "name"}, message = "Enterprise and resource family name already exists.")
@Table(name = "resource_family", schema = "public", catalog = "product_resource")
public class ResourceFamily {
    private Integer id;
    @NotNull(message = "Enterprise is required.")
    private Integer idEnterprise;
    @NotNull(message = "Name is required.")
    @NotEmpty(message = "Enter a valid Name.")
    private String name;
    @Valid
    @NotNull(message = "Resources is required.")
    private Set<Resource> resources;
    private Set<Relation> relationsBase;
    private Set<ResourceFamilyRelation> resourceFamilyRelations;

    @Id
    @Column(name = "id")
    @GeneratedValue(generator = "resource_family_id_seq")
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Basic
    @Column(name = "id_enterprise", nullable = false)
    public Integer getIdEnterprise() {
        return idEnterprise;
    }

    public void setIdEnterprise(Integer idEnterprise) {
        this.idEnterprise = idEnterprise;
    }

    @Basic
    @Column(name = "name", nullable = false, length = -1)
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
        ResourceFamily that = (ResourceFamily) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(idEnterprise, that.idEnterprise) &&
                Objects.equals(name, that.name);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id, idEnterprise, name);
    }

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "id_resource_family")
    public Set<Resource> getResources() {
        return resources;
    }

    public void setResources(Set<Resource> resources) {
        this.resources = resources;
    }

    @JsonIgnore
    @OneToMany(mappedBy = "resourceFamilyBase")
    public Set<Relation> getRelationsBase() {
        return relationsBase;
    }

    public void setRelationsBase(Set<Relation> relationsBase) {
        this.relationsBase = relationsBase;
    }

    @JsonIgnore
    @OneToMany(mappedBy = "resourceFamily")
    public Set<ResourceFamilyRelation> getResourceFamilyRelations() {
        return resourceFamilyRelations;
    }

    public void setResourceFamilyRelations(Set<ResourceFamilyRelation> resourceFamilyRelations) {
        this.resourceFamilyRelations = resourceFamilyRelations;
    }
}
