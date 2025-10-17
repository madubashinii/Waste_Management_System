package com.csse.ecocollectbackend.resident.repository;

import com.csse.ecocollectbackend.resident.entity.Bin;
import com.csse.ecocollectbackend.resident.entity.Zone;
import com.csse.ecocollectbackend.login.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BinRepository extends JpaRepository<Bin, Integer> {

    // Find all bins belonging to a specific resident
    List<Bin> findByResident(User resident);

    // Find all bins in a specific zone
    List<Bin> findByZone(Zone zone);

    // Find bin by QR code
    Bin findByQrCode(String qrCode);
}

