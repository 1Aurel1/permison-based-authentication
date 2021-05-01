package com.obai.auth.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Rolee.
 */
@Entity
@Table(name = "rolee")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Rolee implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 20)
    @Column(name = "name", length = 20, nullable = false)
    private String name;

    @Size(max = 150)
    @Column(name = "description", length = 150)
    private String description;

    @ManyToMany(mappedBy = "rolees")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "rolees", "permisons" }, allowSetters = true)
    private Set<Resouce> resouces = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Rolee id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Rolee name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Rolee description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Resouce> getResouces() {
        return this.resouces;
    }

    public Rolee resouces(Set<Resouce> resouces) {
        this.setResouces(resouces);
        return this;
    }

    public Rolee addResouce(Resouce resouce) {
        this.resouces.add(resouce);
        resouce.getRolees().add(this);
        return this;
    }

    public Rolee removeResouce(Resouce resouce) {
        this.resouces.remove(resouce);
        resouce.getRolees().remove(this);
        return this;
    }

    public void setResouces(Set<Resouce> resouces) {
        if (this.resouces != null) {
            this.resouces.forEach(i -> i.removeRolee(this));
        }
        if (resouces != null) {
            resouces.forEach(i -> i.addRolee(this));
        }
        this.resouces = resouces;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Rolee)) {
            return false;
        }

        if (this.getId() == o) {
            return true;
        }
        if (!(o instanceof Rolee)) {
            return false;
        }
        return id != null && id.equals(((Rolee) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Rolee{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
