// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    addSquareEventListeners() // Add click event listeners to each square
    initializePieces() // Place pieces on the board
    updateCounters() // Update piece counters
    determineStartingPlayer() // Decide which player starts first
})

// Variable to store the selected piece
let selectedPiece = null

// Variable to track the current player
let currentPlayer = null

// Add click event listeners to all squares
function addSquareEventListeners() {
    const squares = document.querySelectorAll(".square")
    squares.forEach(square => {
        square.addEventListener("click", () => handleSquareClick(square))
    })
}

// Handle click event on a square
function handleSquareClick(square) {
    if (selectedPiece) {
        if (selectedPiece === square) {
            // Deselect the piece if the same square is clicked
            selectedPiece.classList.remove("selected")
            selectedPiece = null
        } else {
            movePiece(square) // Move the piece to the clicked square
        }
    } else if (square.firstChild) {
        selectPiece(square) // Select the piece on the clicked square
    }
}

// Select a piece if it belongs to the current player
function selectPiece(square) {
    const piece = square.firstChild
    if ((currentPlayer === "player1" && piece.classList.contains("player1")) ||
        (currentPlayer === "player2" && piece.classList.contains("player2"))) {
        if (selectedPiece) {
            selectedPiece.classList.remove("selected")
        }
        selectedPiece = square
        square.classList.add("selected")
    }
}

// Move the selected piece to the target square if the move is valid
function movePiece(targetSquare) {
    if (isValidMove(targetSquare)) {
        targetSquare.appendChild(selectedPiece.firstChild)
        selectedPiece.classList.remove("selected")
        selectedPiece = null
        updateCounters() // Update piece counters after the move
        switchPlayer() // Switch the turn to the other player
    }
}

// Validate if the move to the target square is allowed
function isValidMove(targetSquare) {
    if (targetSquare.firstChild) return false

    const [startRow, startCol] = selectedPiece.id.split('-').map(Number)
    const [endRow, endCol] = targetSquare.id.split('-').map(Number)
    const piece = selectedPiece.firstChild

    const rowDiff = endRow - startRow
    const colDiff = Math.abs(endCol - startCol)

    if (piece.classList.contains("player1")) {
        if (rowDiff === -1 && colDiff === 1) return true // Simple move
        if (rowDiff === -2 && colDiff === 2) { // Capture move
            const midRow = (startRow + endRow) / 2
            const midCol = (startCol + endCol) / 2
            const midSquare = document.getElementById(`${midRow}-${midCol}`)
            if (midSquare.firstChild && midSquare.firstChild.classList.contains("player2")) {
                midSquare.removeChild(midSquare.firstChild) // Capture the piece
                return true
            }
        }
    } else if (piece.classList.contains("player2")) {
        if (rowDiff === 1 && colDiff === 1) return true // Simple move
        if (rowDiff === 2 && colDiff === 2) { // Capture move
            const midRow = (startRow + endRow) / 2
            const midCol = (startCol + endCol) / 2
            const midSquare = document.getElementById(`${midRow}-${midCol}`)
            if (midSquare.firstChild && midSquare.firstChild.classList.contains("player1")) {
                midSquare.removeChild(midSquare.firstChild) // Capture the piece
                return true
            }
        }
    }
    
    return false
}

// Initialize the pieces on the board
function initializePieces() {
    const player1Positions = [
        "5-0", "5-2", "5-4", "5-6",
        "6-1", "6-3", "6-5", "6-7",
        "7-0", "7-2", "7-4", "7-6"
    ]
    const player2Positions = [
        "0-1", "0-3", "0-5", "0-7",
        "1-0", "1-2", "1-4", "1-6",
        "2-1", "2-3", "2-5", "2-7"
    ]

    // Place player 1 pieces
    player1Positions.forEach(pos => {
        const square = document.getElementById(pos)
        const piece = document.createElement("div")
        piece.classList.add("piece", "player1")
        const icon = document.createElement("i")
        icon.classList.add("fas", "fa-chess-pawn")
        piece.appendChild(icon)
        square.appendChild(piece)
    })

    // Place player 2 pieces
    player2Positions.forEach(pos => {
        const square = document.getElementById(pos)
        const piece = document.createElement("div")
        piece.classList.add("piece", "player2")
        const icon = document.createElement("i")
        icon.classList.add("fas", "fa-chess-pawn")
        piece.appendChild(icon)
        square.appendChild(piece)
    })
}

// Update the counters showing the number of pieces for each player
function updateCounters() {
    const player1Count = document.querySelectorAll('.piece.player1').length
    const player2Count = document.querySelectorAll('.piece.player2').length
    document.getElementById('player1-count').textContent = player1Count
    document.getElementById('player2-count').textContent = player2Count
}

// Determine which player starts the game
function determineStartingPlayer() {
    currentPlayer = Math.random() < 0.5 ? "player1" : "player2"
    updateTurnIndicator()
    alert(`Player ${currentPlayer === "player1" ? "1" : "2"} starts first!`)
}

// Switch the turn to the other player
function switchPlayer() {
    currentPlayer = currentPlayer === "player1" ? "player2" : "player1"
    updateTurnIndicator()
    alert(`It's Player ${currentPlayer === "player1" ? "1" : "2"}'s turn!`)
}

// Update the turn indicator to show the current player's turn
function updateTurnIndicator() {
    const turnIndicator = document.getElementById('turn-indicator')
    if (currentPlayer === "player1") {
        turnIndicator.style.backgroundColor = "red"
    } else {
        turnIndicator.style.backgroundColor = "blue"
    }
}
