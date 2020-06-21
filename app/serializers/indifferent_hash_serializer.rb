# Allows a PSQL json hash to be serialized as an indifferent access hash
# instead of a String keyed hash.
class IndifferentHashSerializer
  def self.dump(hash)
    hash
  end

  def self.load(hash)
    (hash || {}).with_indifferent_access
  end
end
