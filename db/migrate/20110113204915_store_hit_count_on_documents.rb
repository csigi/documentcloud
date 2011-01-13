class StoreHitCountOnDocuments < ActiveRecord::Migration
  def self.up
    add_column 'documents', 'hit_count', :integer, :null => false, :default => 0
    add_index 'documents', ['hit_count'], :name => 'index_documents_on_hit_count'

    # Initial hit counts.
    Document.find_each do |doc|
      doc.update_attributes :hit_count => doc.remote_urls.sum(:hits)
    end
  end

  def self.down
    remove_index 'documents', :name => 'index_documents_on_hit_count'
    remove_column 'documents', 'hit_count'
  end
end
