"""persisting issue

Revision ID: cfa15639d82c
Revises: aa10a5edfd62
Create Date: 2023-06-16 22:07:37.879529

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'cfa15639d82c'
down_revision = 'aa10a5edfd62'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('costs')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('costs',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('name', sa.VARCHAR(length=255), nullable=False),
    sa.Column('amount', sa.FLOAT(), nullable=False),
    sa.Column('category', sa.VARCHAR(length=255), nullable=False),
    sa.Column('event_id', sa.INTEGER(), nullable=False),
    sa.ForeignKeyConstraint(['event_id'], ['events.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###