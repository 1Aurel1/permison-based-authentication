package com.obai.auth.repository;

import com.obai.auth.domain.Rolee;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Rolee entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RoleeRepository extends JpaRepository<Rolee, Long> {}
