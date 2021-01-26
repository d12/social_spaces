class DrawIt::EventHandlers::RevealLetter < EventHandler
  attr_reader :instance

  def initialize(instance:)
    @instance = instance
  end

  def call(data)
    reveal_letter

    storage[:letter_reveal_time] = DrawIt::TIME_BETWEEN_REVEALS.from_now.to_i

    send_gamestate_to_all(instance)
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

  def storage
    instance.storage
  end
end
