package com.devhire.job.repository;

import com.devhire.job.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByTitleContainingIgnoreCase(String title);

    List<Job> findByLocationContainingIgnoreCase(String location);

    List<Job> findByEmploymentTypeIgnoreCase(String employmentType);

    List<Job> findBySalaryGreaterThanEqual(Long salary);

    List<Job> findByRecruiterId(Long recruiterId);

    @Query("""
    SELECT j FROM Job j
    WHERE (:title IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :title, '%')))
      AND (:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%')))
      AND (:employmentType IS NULL OR LOWER(j.employmentType) = LOWER(:employmentType))
      AND (:salary IS NULL OR j.salary >= :salary)
""")
    List<Job> searchJobs(
            @Param("title") String title,
            @Param("location") String location,
            @Param("employmentType") String employmentType,
            @Param("salary") Long salary
    );

    long countByRecruiterId(Long recruiterId);
}