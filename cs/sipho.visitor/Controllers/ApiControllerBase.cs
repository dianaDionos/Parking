using System.Globalization;
using System.Threading;
using Microsoft.AspNetCore.Mvc;

namespace sipho.visitor.Controllers
{
    public class ApiControllerBase : ControllerBase
    {
        /// <summary>
        /// Base controller for all API controllers
        /// </summary>
        public ApiControllerBase()
        {
            // Set the culture for the current thread
            Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture("es-CO");
            Console.WriteLine("Culture changed to: LCID {0} - Name {1}.", Thread.CurrentThread.CurrentCulture.LCID, Thread.CurrentThread.CurrentCulture.Name);
        }
    }
}
