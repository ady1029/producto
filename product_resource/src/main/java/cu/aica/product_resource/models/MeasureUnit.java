package cu.aica.product_resource.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Set;
import java.util.Objects;

@Entity
@Table(name = "measure_unit", schema = "public", catalog = "product_resource")
public class MeasureUnit {
    private int id;
    private String name;

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(generator = "measure_unit_id_seq")
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Basic
    @Column(name = "name", nullable = true, length = 64)
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
        MeasureUnit that = (MeasureUnit) o;
        return id == that.id &&
                Objects.equals(name, that.name);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id, name);
    }
}
