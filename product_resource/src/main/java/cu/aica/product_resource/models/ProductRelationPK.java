package cu.aica.product_resource.models;

import javax.persistence.Column;
import javax.persistence.Id;
import java.io.Serializable;
import java.util.Objects;

public class ProductRelationPK implements Serializable {
    private int idProduct;
    private int idRelation;

    @Column(name = "id_product", nullable = false)
    @Id
    public int getIdProduct() {
        return idProduct;
    }

    public void setIdProduct(int idProduct) {
        this.idProduct = idProduct;
    }

    @Column(name = "id_relation", nullable = false)
    @Id
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
        ProductRelationPK that = (ProductRelationPK) o;
        return idProduct == that.idProduct &&
                idRelation == that.idRelation;
    }

    @Override
    public int hashCode() {

        return Objects.hash(idProduct, idRelation);
    }
}
