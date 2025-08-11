# frozen_string_literal: true

class GraphqlController < ApplicationController
  def execute
    if params[:query]&.include?("budgets")
      render json: {
        data: {
          budgets: [
            {
              id: "1",
              name: "Groceries",
              amount: 500.0,
              description: "Monthly grocery budget",
              createdAt: Time.current.iso8601,
              updatedAt: Time.current.iso8601
            },
            {
              id: "2", 
              name: "Entertainment",
              amount: 200.0,
              description: "Movies, dining out, etc.",
              createdAt: Time.current.iso8601,
              updatedAt: Time.current.iso8601
            }
          ]
        }
      }
      return
    end

    if params[:query]&.include?("createBudget")
      variables = prepare_variables(params[:variables])
      
      new_budget = {
        id: (Time.current.to_f * 1000).to_i.to_s,
        name: variables["name"],
        amount: variables["amount"].to_f,
        description: variables["description"],
        createdAt: Time.current.iso8601,
        updatedAt: Time.current.iso8601
      }

      render json: {
        data: {
          createBudget: {
            budget: new_budget,
            errors: []
          }
        }
      }
      return
    end


  rescue StandardError => e
    raise e unless Rails.env.development?
    handle_error_in_development(e)
  end

  private

  def prepare_variables(variables_param)
    case variables_param
    when String
      if variables_param.present?
        JSON.parse(variables_param) || {}
      else
        {}
      end
    when Hash
      variables_param
    when ActionController::Parameters
      variables_param.to_unsafe_h # GraphQL-Ruby will validate name and type of incoming variables.
    when nil
      {}
    else
      raise ArgumentError, "Unexpected parameter: #{variables_param.class}"
    end
  end

  def handle_error_in_development(e)
    logger.error e.message
    logger.error e.backtrace.join("\n")

    render json: { errors: [{ message: e.message, backtrace: e.backtrace }], data: {} },
           status: :internal_server_error
  end
end
