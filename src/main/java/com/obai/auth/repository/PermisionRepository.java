package com.obai.auth.repository;

import com.obai.auth.domain.Permision;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Permision entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PermisionRepository extends JpaRepository<Permision, Long> {}
