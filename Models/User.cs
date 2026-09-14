using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DotActivDashboard.Models
{
    [Table("tUsers")]
    public class User
    {
        [Key] public int PkUserId { get; set; }
        public string SUsername { get; set; } = string.Empty;  
        public string SPassword { get; set; } = string.Empty;
        public int FkRoleId { get; set; }

        [ForeignKey(nameof(FkRoleId))] 
        public Role? Role { get; set; }
    }
}
