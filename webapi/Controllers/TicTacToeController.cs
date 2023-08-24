using Microsoft.AspNetCore.Mvc;
using webapi.Models;

namespace webapi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TicTacToeController : Controller
    {
        public const int BoardSize = 9;
        public const int BoardArraySize = 3;
        public const int winCombinationOuter = 8;
        public const int winCombinationInner = 3;
        public int[,] winCombination = {  { 1, 5, 9 }, { 3, 5, 7 }, { 1, 2, 3 }, { 4, 5, 6 },
        { 7, 8, 9 }, {1, 4, 7 }, { 2, 5, 8 }, {3, 6, 9} };

        [HttpPost]
        [Route("api/GetMove")]
        public int GetMove(TicTacModel[] board)
        {
            /*
             * the game board for tic tac toe that I'm working with is laid out like this:
             * 1|2|3
             * 4|5|6
             * 7|8|9
             */

            int returnId = -1;
            TicTacModel[] result = new TicTacModel[winCombinationInner];
            // goes over the winning combinations to see if two in a row is occuring
            for (int i = 0; i < winCombinationOuter; i++)
            {
                int nonEmptyCounter = 0;
                int xCounter = 0;
                int oCounter = 0;
                for (int j = 0; j < winCombinationInner; j++)
                {
                    result[j] = Array.Find(board, e => e.Id == winCombination[i, j]);
                    if (!string.IsNullOrEmpty(result[j].Value))
                    {
                        nonEmptyCounter++;
                        if (result[j].Value == "X")
                        {
                            xCounter++;
                        }
                        else if (result[j].Value == "O")
                        {
                            oCounter++;
                        }
                    }
                }
                if (nonEmptyCounter == 2 && (xCounter == 2 || oCounter == 2))
                {
                    for (int j = 0; j < winCombinationInner; j++)
                    {
                        result[j] = Array.Find(board, e => e.Id == winCombination[i, j]);
                        if (string.IsNullOrEmpty(result[j].Value))
                        {
                            returnId = result[j].Id - 1;
                            break;
                        }
                    }
                }
                if (returnId != -1)
                {
                    break;
                }
            }
            if (returnId == -1)
            {
                // if no win conditions are found, searches for available free space. order is determined by which position I think is the best
                int[] possibleMoves = { 4, 0, 8, 5, 3 };
                for (int i = 0; i < possibleMoves.Length; i++)
                {
                    if (string.IsNullOrEmpty(board[possibleMoves[i]].Value))
                    {
                        returnId = possibleMoves[i];
                        break;
                    }
                }
            }
            return returnId;
        }

        [HttpPost]
        [Route("api/CalculateGameOver")]
        public bool CalculateGameOver(TicTacModel[] board)
        {
            bool isGameOver = false;
            TicTacModel[] result = new TicTacModel[winCombinationInner];
            for (int i = 0; i < winCombinationOuter; i++)
            {
                int xCounter = 0;
                int oCounter = 0;
                for (int j = 0; j < winCombinationInner; j++)
                {
                    // checks only winning combinations on the board
                    result[j] = Array.Find(board, e => e.Id == winCombination[i, j]);
                    if (!string.IsNullOrEmpty(result[j].Value))
                    {
                        if (result[j].Value == "X")
                        {
                            xCounter++;
                        }
                        else if (result[j].Value == "O")
                        {
                            oCounter++;
                        }
                    }
                }
                // none of the fields are free or three in a row is achieved
                if (Array.Find(board, e => string.IsNullOrEmpty(e.Value)) == null ||
                    (xCounter == 3 || oCounter == 3))
                {
                    // win condition
                    isGameOver = true;
                    break;
                }
            }
            return isGameOver;
        }
    }
}
