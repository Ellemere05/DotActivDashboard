using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DotActivDashboard.Models
{
    [Table("tStores")]
    public class Store
    {
        [Key] public int PkStoreId { get; set; }
        public string SStoreCode { get; set; } = string.Empty;
        public string SStoreName { get; set; } = string.Empty;
        public string SDivision { get; set; } = string.Empty;
        public string SProvince { get; set; } = string.Empty;
        public int IOverduePlanograms { get; set; }
    }
}
