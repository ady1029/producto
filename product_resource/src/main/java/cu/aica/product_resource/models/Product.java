package cu.aica.product_resource.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Set;
import java.util.Objects;

@Entity
@Table(name = "product", schema = "public", catalog = "product_resource")
public class Product {
    private Integer id;
    @NotNull(message = "UEB is required.")
    private Integer codUeb;
    @NotNull(message = "CUP is required.")
    @NotEmpty(message = "Enter a valid CUP.")
    private String cup;
    @NotNull(message = "Codigo is required.")
    @NotEmpty(message = "Enter a valid Codigo.")
    private String codigo;
    private Integer idProductFamily;
    private ProductFamily productFamily;
    private Set<ProductRelation> productRelations;

    @Id
    @Column(name = "id")
    @GeneratedValue(generator = "product_id_seq")
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Basic
    @Column(name = "cod_ueb", nullable = false)
    public Integer getCodUeb() {
        return codUeb;
    }

    public void setCodUeb(Integer codUeb) {
        this.codUeb = codUeb;
    }

    @Basic
    @Column(name = "cup", nullable = false, length = 256)
    public String getCup() {
        return cup;
    }

    public void setCup(String cup) {
        this.cup = cup;
    }

    @Basic
    @Column(name = "codigo", nullable = false, length = 256)
    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    @Basic
    @Column(name = "id_product_family")
    public Integer getIdProductFamily() {
        return idProductFamily;
    }

    public void setIdProductFamily(Integer idProductFamily) {
        this.idProductFamily = idProductFamily;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Product product = (Product) o;
        return Objects.equals(id, product.id) &&
                Objects.equals(codUeb, product.codUeb) &&
                Objects.equals(cup, product.cup) &&
                Objects.equals(idProductFamily, product.idProductFamily) &&
                Objects.equals(codigo, product.codigo);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id, codUeb, cup, idProductFamily, codigo);
    }

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "id_product_family", referencedColumnName = "id", insertable=false, updatable=false)
    public ProductFamily getProductFamily() {
        return productFamily;
    }

    public void setProductFamily(ProductFamily productFamily) {
        this.productFamily = productFamily;
    }

    @JsonIgnore
    @OneToMany(mappedBy = "product")
    public Set<ProductRelation> getProductRelations() {
        return productRelations;
    }

    public void setProductRelations(Set<ProductRelation> productRelations) {
        this.productRelations = productRelations;
    }

}
