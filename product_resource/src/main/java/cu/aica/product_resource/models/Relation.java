package cu.aica.product_resource.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.sql.Date;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "relation", schema = "public", catalog = "product_resource")
public class Relation {
    private int id;
    @NotNull(message = "Product Family is required.")
    private Integer idProductFamily;
    @NotNull(message = "Name is required.")
    @NotEmpty(message = "Enter a valid Name.")
    private String name;
    @NotNull(message = "Criterio is required.")
    @NotEmpty(message = "Enter a valid Criterio.")
    private String criterio;
    private Date date;
    private Integer idResourceFamily;
    @NotNull(message = "Base count is required.")
    private Integer baseCount;
    private ProductFamily productFamily;
    private Set<ProductRelation> productRelations;
    @NotNull(message = "Products is required.")
    private Set<Product> products;
    private ResourceFamily resourceFamilyBase;
    @Valid
    @NotNull(message = "Resources Families is required.")
    private Set<ResourceFamilyRelation> resourceFamilyRelations;

    @Id
    @Column(name = "id")
    @GeneratedValue(generator = "relation_id_seq")
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Basic
    @Column(name = "id_product_family", nullable = false)
    public Integer getIdProductFamily() {
        return idProductFamily;
    }

    public void setIdProductFamily(Integer idProductFamily) {
        this.idProductFamily = idProductFamily;
    }

    @Basic
    @Column(name = "name", nullable = false, length = 256)
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Basic
    @Column(name = "criterio", nullable = false, length = 256)
    public String getCriterio() {
        return criterio;
    }

    public void setCriterio(String criterio) {
        this.criterio = criterio;
    }

    @Basic
    @Column(name = "date", nullable = true)
    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    @Basic
    @Column(name = "id_resource_family", nullable = true)
    public Integer getIdResourceFamily() {
        return idResourceFamily;
    }

    public void setIdResourceFamily(Integer idResourceFamily) {
        this.idResourceFamily = idResourceFamily;
    }

    @Basic
    @Column(name = "base_count", nullable = true)
    public Integer getBaseCount() {
        return baseCount;
    }

    public void setBaseCount(Integer baseCount) {
        this.baseCount = baseCount;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Relation relation = (Relation) o;
        return id == relation.id &&
                Objects.equals(name, relation.name) &&
                Objects.equals(criterio, relation.criterio) &&
                Objects.equals(date, relation.date) &&
                Objects.equals(idResourceFamily, relation.idResourceFamily) &&
                Objects.equals(baseCount, relation.baseCount);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id, name, criterio, date, idResourceFamily, baseCount);
    }

    @ManyToOne
    @JoinColumn(name = "id_product_family", referencedColumnName = "id", insertable = false, updatable = false)
    public ProductFamily getProductFamily() {
        return productFamily;
    }

    public void setProductFamily(ProductFamily productFamily) {
        this.productFamily = productFamily;
    }

    @JsonIgnore
    @OneToMany(mappedBy = "relation")
    public Set<ProductRelation> getProductRelations() {
        return productRelations;
    }

    public void setProductRelations(Set<ProductRelation> productRelations) {
        this.productRelations = productRelations;
    }

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "product_relation",
            joinColumns = {@JoinColumn(name = "id_relation", referencedColumnName = "id", insertable = false, updatable = false)},
            inverseJoinColumns = {@JoinColumn(name = "id_product", referencedColumnName = "id", insertable = false, updatable = false)})
    public Set<Product> getProducts() {
        return products;
    }

    public void setProducts(Set<Product> products) {
        this.products = products;
    }


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_resource_family", referencedColumnName = "id", insertable = false, updatable = false)
    public ResourceFamily getResourceFamilyBase() {
        return resourceFamilyBase;
    }

    public void setResourceFamilyBase(ResourceFamily resourceFamilyBase) {
        this.resourceFamilyBase = resourceFamilyBase;
    }

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "id_relation")
    public Set<ResourceFamilyRelation> getResourceFamilyRelations() {
        return resourceFamilyRelations;
    }

    public void setResourceFamilyRelations(Set<ResourceFamilyRelation> resourceFamilyRelations) {
        this.resourceFamilyRelations = resourceFamilyRelations;
    }


}
