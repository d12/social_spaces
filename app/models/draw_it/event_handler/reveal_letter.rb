class DrawIt::EventHandler::RevealLetter < EventHandler
  include DrawIt::EventHandlerHelper

  attr_reader :instance

  def initialize(instance:)
    @instance = instance
  end

  def call(data)
    current_factor_revealed = (storage[:given_letters].length - storage[:given_letters].count("_") * 1.0) / storage[:given_letters].length
    current_factor_per_s = current_factor_revealed / (DrawIt::ROUND_LENGTH - instance.time_til_round_end)
    target_factor_per_s = DrawIt::AMOUNT_OF_WORD_TO_REVEAL / DrawIt::ROUND_LENGTH

    if(current_factor_per_s < target_factor_per_s)
      reveal_letter
      storage[:letter_reveal_time] = DrawIt::TIME_BETWEEN_REVEAL_CHECKS.from_now.to_i
      send_gamestate_to_all(instance)
    end
  end

  private

  def reveal_letter
    hidden_letters_indices = get_hidden_letter_indicies
    return if hidden_letters_indices.length == 0

    index_to_reveal = hidden_letters_indices.sample

    storage[:given_letters][index_to_reveal] = storage[:chosen_word][index_to_reveal]

    instance.save
    send_gamestate_to_all(instance)
  end

  def get_hidden_letter_indicies
    word = storage[:given_letters]
    (0 ... word.length).find_all { |i| word[i] == "_" }
  end
end
