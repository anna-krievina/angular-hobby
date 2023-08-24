using Microsoft.AspNetCore.Mvc;
using webapi.Models;

namespace webapi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CalculatorController : Controller
    {
        public const string Add = "+";
        public const string Subtract = "-";
        public const string Multipy = "*";
        public const string Divide = "÷";
        public const string Undo = "⌫";
        public const string Reset = "C";
        public const string Result = "=";
        public const string Negate = "+/-";

        public string[] Operation = { Add, Subtract, Multipy, Divide };
        public string[] Action = { Undo, Reset, Result };

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
                    int firstNumber = int.Parse(resultArray[0]);
                    int secondNumber = int.Parse(resultArray[2]);
                    int resultNumber = 0;
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
                    result = resultNumber.ToString();
                }
                catch (Exception e)
                {
                    // in case of error, just return the result
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
                int firstNumber = int.Parse(resultArray[0]);
                int resultNumber = 0 - firstNumber;
                result = resultNumber.ToString();
            }
            return result;
        }
    }
}
