using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Table;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Collab_Helper_Functions.Models;

namespace Collab_Helper_Functions
{
    public static class Functions
    {
        [FunctionName("TripEndpoint")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Trip/{tripId}")] HttpRequest req,
            string tripId,
            [Table("Trips", Connection = "table-storage-connection-string")] CloudTable tripsTable,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function: TripEndpoint.");

            string queryFilter = TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, tripId);

            TableQuery<Trip> tripQuery = new TableQuery<Trip>().Where(queryFilter);

            var querySegment = await tripsTable.ExecuteQuerySegmentedAsync(tripQuery, null);

            var result = from r in querySegment.Results
                         select new
                         {
                             Id = r.RowKey,
                             r.Timestamp,
                             r.HelperId,
                             r.HelperName,
                             r.TripDate
                         };
            return new JsonResult(result);
        }
    }
}
