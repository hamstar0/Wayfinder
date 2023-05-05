using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wayfinder.Migrations
{
    public partial class RecipOneToMany : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "Id",
                table: "PlanSteps",
                type: "bigint",
                nullable: false,
                defaultValue: 0L)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<long>(
                name: "PlanEntryId",
                table: "PlanSteps",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "Id",
                table: "Events",
                type: "bigint",
                nullable: false,
                defaultValue: 0L)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<long>(
                name: "ScheduleEntryId",
                table: "Events",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_PlanSteps",
                table: "PlanSteps",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Events",
                table: "Events",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_PlanSteps_PlanEntryId",
                table: "PlanSteps",
                column: "PlanEntryId");

            migrationBuilder.CreateIndex(
                name: "IX_Events_ScheduleEntryId",
                table: "Events",
                column: "ScheduleEntryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Events_EventSchedules_ScheduleEntryId",
                table: "Events",
                column: "ScheduleEntryId",
                principalTable: "EventSchedules",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PlanSteps_Plans_PlanEntryId",
                table: "PlanSteps",
                column: "PlanEntryId",
                principalTable: "Plans",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Events_EventSchedules_ScheduleEntryId",
                table: "Events");

            migrationBuilder.DropForeignKey(
                name: "FK_PlanSteps_Plans_PlanEntryId",
                table: "PlanSteps");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PlanSteps",
                table: "PlanSteps");

            migrationBuilder.DropIndex(
                name: "IX_PlanSteps_PlanEntryId",
                table: "PlanSteps");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Events",
                table: "Events");

            migrationBuilder.DropIndex(
                name: "IX_Events_ScheduleEntryId",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "PlanSteps");

            migrationBuilder.DropColumn(
                name: "PlanEntryId",
                table: "PlanSteps");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "ScheduleEntryId",
                table: "Events");
        }
    }
}
