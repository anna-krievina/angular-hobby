using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using webapi.Models;

namespace webapi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CalculatorController : Controller
    {
        public const string Add = "+";
        public const string Subtract = "–";
        public const string Multipy = "*";
        public const string Divide = "÷";

        [HttpPost]
        [Route("api/Calculate")]
        public string Calculate(ResultModel model)
        {
            string result = model.Result;
            string[] resultArray = result.Split(' ');
            if (resultArray.Length == 3)
            {
                try
                {
                    decimal firstNumber = decimal.Parse(resultArray[0], CultureInfo.InvariantCulture);
                    decimal secondNumber = decimal.Parse(resultArray[2], CultureInfo.InvariantCulture);
                    decimal resultNumber = 0;
                    switch (resultArray[1])
                    {
                        case Add:
                            resultNumber = firstNumber + secondNumber;
                            break;
                        case Subtract:
                            resultNumber = firstNumber - secondNumber;
                            break;
                        case Divide:
                            resultNumber = firstNumber / secondNumber;
                            break;
                        case Multipy:
                            resultNumber = firstNumber * secondNumber;
                            break;
                    }
                    result = resultNumber.ToString(CultureInfo.InvariantCulture);
                }
                catch (Exception e)
                {
                    // in case of error, just return the result
                    Console.WriteLine(e.Message);
                }
            }
            return result;
        }

        [HttpPost]
        [Route("api/NegateResult")]
        public string NegateResult(ResultModel model)
        {
            string result = model.Result;
            string[] resultArray = result.Split(' ');
            if (resultArray.Length > 0)
            {
                decimal firstNumber = decimal.Parse(resultArray[0], CultureInfo.InvariantCulture);
                decimal resultNumber = 0 - firstNumber;
                result = resultNumber.ToString();
            }
            return result;
        }
    }
}
