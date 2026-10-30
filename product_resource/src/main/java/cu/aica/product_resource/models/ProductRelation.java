package cu.aica.product_resource.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "product_relation", schema = "public", catalog = "product_resource")
@IdClass(ProductRelationPK.class)
public class ProductRelation {
    private int idProduct;
    private int idRelation;
    private Product product;
    private Relation relation;

    @Id
    @Column(name = "id_product", nullable = false)
    public int getIdProduct() {
        return idProduct;
    }

    public void setIdProduct(int idProduct) {
        this.idProduct = idProduct;
    }

    @Id
    @Column(name = "id_relation", nullable = false)
    public int getIdRelation() {
        return idRelation;
    }

    public void setIdRelation(int idRelation) {
        this.idRelation = idRelation;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProductRelation that = (ProductRelation) o;
        return idProduct == that.idProduct &&
                idRelation == that.idRelation;
    }

    @Override
    public int hashCode() {

        return Objects.hash(idProduct, idRelation);
    }

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_product", referencedColumnName = "id", nullable = false, insertable = false, updatable = false)
    public Product getProduct() {
        return product;
    }

    public void setProduct(Product productByIdProduct) {
        this.product = productByIdProduct;
    }

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_relation", referencedColumnName = "id", nullable = false, insertable = false, updatable = false)
    public Relation getRelation() {
        return relation;
    }

    public void setRelation(Relation relation) {
        this.relation = relation;
    }
}
