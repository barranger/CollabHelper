using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Text;

namespace Collab_Helper_Functions.Models
{
    public class Trip : TableEntity
    {
        public DateTime TripDate { get; set; }
        public string HelperName { get; set; }
        public int HelperId { get; set; }
        public DateTime TimeStamp { get; set; }

    }
}
