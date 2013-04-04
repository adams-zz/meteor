if Meteor.isClient
  class window.Card extends Backbone.Model
    initialize: ->
        name: ""
        suit: ""
        value: ""

  class window.Deck extends Backbone.Collection
      model: Card
      shuffle: (newDeck) ->
        @deckIndex = 0
        _.shuffle newDeck

  class Hand
    constructor: (dealer) ->
      @aceCount = 0    
      @cards = []
      @total = 0
      @dealer = dealer

    addCard: (card) ->
      val = card.get("value")
      @cards.push card
      if val is 1
        @aceCount++
      @total += val

    showDealer: ->
      @dealer = false

    getCard: (index) ->
      @cards[index]

    getTotal: ->
      if @dealer
        @cards[0].get "value"
      else if (@aceCount > 0) and (@total < 22)
        @aceCount--
        @total += 10
      else
        @total

  class window.BlackjackView extends Backbone.View

    events:
      "click .hit-button": "hit"
      "click .stand-button": "stand"
      "click .reset-button": "reset"

    initialize: ->
      @balance = 100
      @newDeckMaker()
      @reset()

    newDeckMaker: ->
      newDeck = []
      for card in [0..51]
        switch Math.floor card / 13
          when 0 then suit = "Spades"
          when 1 then suit = "Hearts"
          when 2 then suit = "Diamonds"
          else suit = "Clubs"
        switch card % 13
          when 0
            name = "Ace"
            value = 1
          when 10
            name = "Jack"
            value = 10
          when 11
            name = "Queen"
            value = 10
          when 12
            name = "King"
            value = 10
          else name = value = card % 13 + 1
        newDeck[card] = new Card name: name, suit: suit, value: value
      @deck = new Deck newDeck
      @shuffledDeck = @deck.shuffle newDeck

    reset: ->
      $("span").remove ".card"
      @player = new Hand
      @dealer = new Hand {dealer:true}
      @player.addCard @shuffledDeck[@deck.deckIndex++]
      @dealer.addCard @shuffledDeck[@deck.deckIndex++]
      @player.addCard @shuffledDeck[@deck.deckIndex++]
      @dealer.addCard @shuffledDeck[@deck.deckIndex++]

      @render true, @dealer.getCard 0
      @render false, @player.getCard 0
      @render false, @player.getCard 1
      @newDeckMaker()


    hit: ->
      addindex = 2
      @player.addCard @shuffledDeck[@deck.deckIndex++]
      @render false, @player.getCard addindex++
      if @player.getTotal() is 21
        $(".result").text "You win, Boom!"
        @balance += 5
        # @reset()
      if @player.getTotal() > 21
        $(".result").text "You bust, bummer...."
        @balance -= 5
        # @reset()

    stand: ->
      dealerIndex = 2
      @dealer.showDealer()
      @render true, @dealer.getCard 1
      while @dealer.getTotal() < 17
        @dealer.addCard @shuffledDeck[@deck.deckIndex++]
        @render true, @dealer.getCard dealerIndex++
      if (@dealer.getTotal() > 21) or (@player.getTotal() > @dealer.getTotal())
        $(".result").text "You win, Yeeea Boyee!"
        @balance += 5
      else if @dealer.getTotal() > @player.getTotal()
        $(".result").text "Dealer wins..."
        @balance -= 5
      else if @dealer.getTotal() is @player.getTotal()
        $(".result").text "Push... lameoooo!"

    buildCard = (id, type, value, side) ->
      card = undefined
      unless side is "back"
        cardValue = (if (value is 1) then "A" else (if (value is 11) then "J" else (if (value is 12) then "Q" else (if (value is 13) then "K" else value))))
        cardIcon = (if (type is "Hearts") then "♥" else (if (type is "Diamonds") then "♦" else (if (type is "Spades") then "♠" else "♣")))
        corner = "<div><span>" + cardValue + "</span><span>" + cardIcon + "</span></div>"
        icons = ""
        if value <= 10
          i = 1
          l = value

          while i <= l
            icons += "<span>" + cardIcon + "</span>"
            i++
        else
          icons = (if (value is 11) then "<span>♝</span>" else (if (value is 12) then "<span>♛</span>" else (if (value is 13) then "<span>♚</span>" else "")))
        card = $("<div data-id=\"" + id + "\" class=\"card value" + cardValue + " " + type + "\">" + corner + "<div class=\"icons\">" + icons + "</div>" + corner + "</div>")
      card

    render: (isDealer, card) ->
      if isDealer
        $('.dealer-cards').append "<span class='card'>#{card.get 'name'}<br> of <br>#{card.get 'suit'}</span>"
      else $('.player-cards').append "<span class='card'>#{card.get 'name'} <br> of <br>#{card.get 'suit'}</span>"
      $('.dealer-score').text @dealer.getTotal();
      $('.player-score').text @player.getTotal();
      # suit = card.get "suit"
      # $(".card").css color: "red" if card.get("suit") is "Hearts" or card.get("suit") is "Diamonds"
      $(".balance").html @balance

  Meteor.startup ->
    blackjackView = new BlackjackView
      el: window.document.body