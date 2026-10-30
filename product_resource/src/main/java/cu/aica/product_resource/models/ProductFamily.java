package cu.aica.product_resource.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import cu.aica.product_resource.utils.validation.NameUnique;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.validation.annotation.Validated;

import javax.persistence.*;
import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.sql.Date;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Entity
@NameUnique(columnNames={"idEnterprise", "name"}, message = "Enterprise and product family name already exists.")
@Table(name = "product_family", schema = "public", catalog = "product_resource")
public class ProductFamily {

    private Integer id;
    @NotNull(message = "Enterprise is required.")
    private Integer idEnterprise;
    @NotNull(message = "Name is required.")
    @NotEmpty(message = "Enter a valid Name.")
    private String name;
    private String format;
    private Boolean lyophilized;
    private Boolean reserve;
    private String atc;
    private Integer priority;
    private Integer nationalDemand;
    private Date updated;
    private Integer planThisYear;
    private Integer planNextYear;
    @Valid
    @NotNull(message = "Products is required.")
    private List<Product> products;
    private Set<Relation> relations;

    @Id
    @Column(name = "id")
    @GeneratedValue(generator = "product_family_id_seq")
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
    @Column(name = "name", nullable = false, length = 256)
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Basic
    @Column(name = "format", length = 256)
    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    @Basic
    @Column(name = "lyophilized")
    public Boolean getLyophilized() {
        return lyophilized;
    }

    public void setLyophilized(Boolean lyophilized) {
        this.lyophilized = lyophilized;
    }

    @Basic
    @Column(name = "reserve")
    public Boolean getReserve() {
        return reserve;
    }

    public void setReserve(Boolean reserve) {
        this.reserve = reserve;
    }

    @Basic
    @Column(name = "atc", length = 256)
    public String getAtc() {
        return atc;
    }

    public void setAtc(String atc) {
        this.atc = atc;
    }

    @Basic
    @Column(name = "priority")
    public Integer getPriority() {
        return priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    @Basic
    @Column(name = "national_demand")
    public Integer getNationalDemand() {
        return nationalDemand;
    }

    public void setNationalDemand(Integer nationalDemand) {
        this.nationalDemand = nationalDemand;
    }

    @Basic
    @Column(name = "updated")
    public Date getUpdated() {
        return updated;
    }

    public void setUpdated(Date updated) {
        this.updated = updated;
    }

    @Basic
    @Column(name = "plan_this_year")
    public Integer getPlanThisYear() {
        return planThisYear;
    }

    public void setPlanThisYear(Integer planThisYear) {
        this.planThisYear = planThisYear;
    }

    @Basic
    @Column(name = "plan_next_year")
    public Integer getPlanNextYear() {
        return planNextYear;
    }

    public void setPlanNextYear(Integer planNextYear) {
        this.planNextYear = planNextYear;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProductFamily that = (ProductFamily) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(idEnterprise, that.idEnterprise) &&
                Objects.equals(name, that.name) &&
                Objects.equals(format, that.format) &&
                Objects.equals(lyophilized, that.lyophilized) &&
                Objects.equals(reserve, that.reserve) &&
                Objects.equals(atc, that.atc) &&
                Objects.equals(priority, that.priority) &&
                Objects.equals(nationalDemand, that.nationalDemand) &&
                Objects.equals(planThisYear, that.planThisYear) &&
                Objects.equals(planNextYear, that.planNextYear) &&
                Objects.equals(updated, that.updated);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id, idEnterprise, name, format, lyophilized, reserve, atc, priority, nationalDemand, planThisYear, planNextYear, updated);
    }


    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "id_product_family")
    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }

    @JsonIgnore
    @OneToMany(mappedBy = "productFamily")
    public Set<Relation> getRelations() {
        return relations;
    }

    public void setRelations(Set<Relation> relations) {
        this.relations = relations;
    }
}
