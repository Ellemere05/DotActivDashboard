using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DotActivDashboard.Models
{
    [Table("tRoles")]
    public class Role
    {
        [Key] public int PkRoleId { get; set; }
        public string SRoleName { get; set; } = string.Empty;
        public string? SProvince { get; set; }
    }
}
