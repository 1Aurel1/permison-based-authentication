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
 * A Resouce.
 */
@Entity
@Table(name = "resouce")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Resouce implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 200)
    @Column(name = "address", length = 200, nullable = false)
    private String address;

    @NotNull
    @Size(max = 30)
    @Column(name = "method", length = 30, nullable = false)
    private String method;

    @Size(max = 200)
    @Column(name = "description", length = 200)
    private String description;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JoinTable(
        name = "rel_resouce__rolee",
        joinColumns = @JoinColumn(name = "resouce_id"),
        inverseJoinColumns = @JoinColumn(name = "rolee_id")
    )
    @JsonIgnoreProperties(value = { "resouces" }, allowSetters = true)
    private Set<Rolee> rolees = new HashSet<>();

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JoinTable(
        name = "rel_resouce__permison",
        joinColumns = @JoinColumn(name = "resouce_id"),
        inverseJoinColumns = @JoinColumn(name = "permison_id")
    )
    @JsonIgnoreProperties(value = { "resouces" }, allowSetters = true)
    private Set<Permision> permisons = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Resouce id(Long id) {
        this.id = id;
        return this;
    }

    public String getAddress() {
        return this.address;
    }

    public Resouce address(String address) {
        this.address = address;
        return this;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getMethod() {
        return this.method;
    }

    public Resouce method(String method) {
        this.method = method;
        return this;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getDescription() {
        return this.description;
    }

    public Resouce description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Rolee> getRolees() {
        return this.rolees;
    }

    public Resouce rolees(Set<Rolee> rolees) {
        this.setRolees(rolees);
        return this;
    }

    public Resouce addRolee(Rolee rolee) {
        this.rolees.add(rolee);
        rolee.getResouces().add(this);
        return this;
    }

    public Resouce removeRolee(Rolee rolee) {
        this.rolees.remove(rolee);
        rolee.getResouces().remove(this);
        return this;
    }

    public void setRolees(Set<Rolee> rolees) {
        this.rolees = rolees;
    }

    public Set<Permision> getPermisons() {
        return this.permisons;
    }

    public Resouce permisons(Set<Permision> permisions) {
        this.setPermisons(permisions);
        return this;
    }

    public Resouce addPermison(Permision permision) {
        this.permisons.add(permision);
        permision.getResouces().add(this);
        return this;
    }

    public Resouce removePermison(Permision permision) {
        this.permisons.remove(permision);
        permision.getResouces().remove(this);
        return this;
    }

    public void setPermisons(Set<Permision> permisions) {
        this.permisons = permisions;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Resouce)) {
            return false;
        }
        return id != null && id.equals(((Resouce) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Resouce{" +
            "id=" + getId() +
            ", address='" + getAddress() + "'" +
            ", method='" + getMethod() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
