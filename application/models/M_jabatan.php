<?php
class M_jabatan extends CI_Model
{

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    public function insert_jabatan($data)
    {
        return $this->db->insert('jabatan', $data);
    }

    public function get_jabatan_data()
    {
        $sql = "SELECT a.employmentId, a.employmentCode kode, IFNULL(b.employmentName,'-') atasan, a.employmentName nama,departmentName, a.employmentActive
        from employment a
        left join employment b on b.employmentId = a.employmentParentEmploymentId
        JOIN department ON departmentId = a.employmentDepartmentId
        where a.employmentDelete=0";
        $query = $this->db->query($sql);
        return $query->result();
    }

    public function get_atasan($id)
    {
        $sql = "SELECT employmentId, employmentCode kode, employmentName atasan
        from employment 
        JOIN department ON departmentId = employmentDepartmentId
        where employmentDelete=0
        and employmentDepartmentId='{$id}'";
        $query = $this->db->query($sql);
        return $query->result();
    }

    public function delete_table($id) {
        $sql = "UPDATE employment SET employmentDelete = 1 WHERE employmentId = '$id'";
        return $this->db->query($sql, array($id));
    }

    public function active_data($id)
    {
        $sql = "UPDATE employment SET employmentActive = if(employmentActive = 1, 0, 1) WHERE employmentId='$id'";
        return $this->db->query($sql);
    }
}
?>