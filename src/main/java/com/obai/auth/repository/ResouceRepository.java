package com.obai.auth.repository;

import com.obai.auth.domain.Resouce;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Resouce entity.
 */
@Repository
public interface ResouceRepository extends JpaRepository<Resouce, Long> {
    @Query(
        value = "select distinct resouce from Resouce resouce left join fetch resouce.rolees left join fetch resouce.permisons",
        countQuery = "select count(distinct resouce) from Resouce resouce"
    )
    Page<Resouce> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct resouce from Resouce resouce left join fetch resouce.rolees left join fetch resouce.permisons")
    List<Resouce> findAllWithEagerRelationships();

    @Query("select resouce from Resouce resouce left join fetch resouce.rolees left join fetch resouce.permisons where resouce.id =:id")
    Optional<Resouce> findOneWithEagerRelationships(@Param("id") Long id);
}
